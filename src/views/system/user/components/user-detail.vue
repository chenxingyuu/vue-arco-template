<template>
  <a-drawer
    :title="title"
    :visible="visible"
    width="40%"
    unmount-on-close
    @close="handleClose"
    @ok="handleSave"
    @cancel="handleClose"
  >
    <a-form
      :model="formModel"
      :label-col-props="{ span: 6 }"
      :wrapper-col-props="{ span: 18 }"
      :auto-label-width="true"
      label-align="right"
    >
      <a-form-item field="username" :label="$t('system.user.form.username')">
        <a-input
          v-model="formModel.username"
          :placeholder="$t('system.user.form.username.placeholder')"
          :readonly="isDetailMode"
        />
      </a-form-item>
      <a-form-item
        field="permissions"
        :label="$t('system.user.form.permissions')"
      >
        <a-spin v-if="permissionLoading" />
        <a-transfer
          v-else
          :title="['所有', '当前']"
          :data="allPermissions"
          :default-value="userPermissions"
          @change="handlePermissionChange"
        >
        </a-transfer>
      </a-form-item>
      <a-form-item field="permissions" :label="$t('system.user.form.roles')">
        <a-spin v-if="roleLoading" />
        <a-transfer
          v-else
          :title="['所有', '当前']"
          :data="allRoles"
          :default-value="userRoles"
          @change="handleRoleChange"
        >
        </a-transfer>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
  import { ref, defineProps, defineEmits, watch, computed } from 'vue';
  import { TransferItem } from '@arco-design/web-vue/es/transfer/interface';
  import { getAllPermission } from '@/api/system/permissions';
  import useLoading from '@/hooks/loading';
  import { isEqual } from 'lodash';
  import { getUserPermissions, getUserRoles } from '@/api/system/users';
  import { getAllRole } from '@/api/system/roles';

  // 创建两个 useLoading 实例
  const { loading: permissionLoading, setLoading: setPermissionLoading } =
    useLoading(false);
  const { loading: roleLoading, setLoading: setRoleLoading } =
    useLoading(false);

  const props = defineProps({
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: '新增权限',
    },
    mode: {
      type: String,
      default: 'detail', // add, edit, detail
    },
    userId: {
      type: Number,
      default: 0,
    },
    initialFormModel: {
      type: Object as () => { username: string },
      default: () => ({ username: '' }),
    },
  });

  const emit = defineEmits(['update:visible', 'add', 'edit']);

  const formModel = ref({ ...props.initialFormModel });
  const originalFormModel = ref({ ...props.initialFormModel }); // 保存初始状态

  const allPermissions = ref<TransferItem[]>([]);
  const allRoles = ref<TransferItem[]>([]);

  const userPermissions = ref<string[]>([]);
  const originalUserPermissions = ref<string[]>([]); // 保存初始状态

  const userRoles = ref<string[]>([]);
  const originalUserRoles = ref<string[]>([]); // 保存初始状态

  const fetchAllPermissions = async () => {
    try {
      const { data } = await getAllPermission();
      allPermissions.value = data.map((permission) => ({
        value: `${permission.id}`,
        label: permission.name,
        disabled: false,
      }));
    } catch (err) {
      // Handle error
    } finally {
      // finally
    }
  };
  const fetchAllRoles = async () => {
    try {
      const { data } = await getAllRole();
      allRoles.value = data.map((role) => ({
        value: `${role.id}`,
        label: role.name,
        disabled: false,
      }));
    } catch (err) {
      // Handle error
    } finally {
      // finally
    }
  };

  fetchAllPermissions();
  fetchAllRoles();

  const fetchUserPermissions = async () => {
    try {
      setPermissionLoading(true);
      const { data } = await getUserPermissions(props.userId);
      // 将返回的数据转换为 a-transfer 组件需要的格式
      userPermissions.value = data.map((permission) => `${permission.id}`);
      originalUserPermissions.value = [...userPermissions.value]; // 保存初始状态
    } catch (err) {
      // Handle error
    } finally {
      // finally
      setPermissionLoading(false);
    }
  };

  const fetchUserRoles = async () => {
    try {
      setRoleLoading(true);
      const { data } = await getUserRoles(props.userId);
      // 将返回的数据转换为 a-transfer 组件需要的格式
      userRoles.value = data.map((role) => `${role.id}`);
      originalUserRoles.value = [...userRoles.value]; // 保存初始状态
    } catch (err) {
      // Handle error
    } finally {
      // finally
      setRoleLoading(false);
    }
  };

  // 处理 a-transfer 中选中的项变化
  const handlePermissionChange = (newTargetKeys: string[]) => {
    userPermissions.value = newTargetKeys;
    // 这里的 newTargetKeys 是用户当前选中的项的 key 列表
    // 你可以在这里添加其他逻辑，例如保存选中的权限到服务器
  };
  const handleRoleChange = (newTargetKeys: string[]) => {
    userRoles.value = newTargetKeys;
    // 这里的 newTargetKeys 是用户当前选中的项的 key 列表
    // 你可以在这里添加其他逻辑，例如保存选中的权限到服务器
  };

  watch(
    () => props.visible,
    () => {
      if (props.visible === true) {
        if (props.userId !== 0) {
          fetchUserPermissions();
          fetchUserRoles();
        }
        originalFormModel.value = { ...props.initialFormModel }; // 保存初始状态
      } else {
        userPermissions.value = [];
        originalUserPermissions.value = [...userPermissions.value];
        userRoles.value = [];
        originalUserRoles.value = [...userRoles.value];
      }
    }
  );

  watch(
    () => props.initialFormModel,
    (newVal) => {
      formModel.value = { ...newVal };
    }
  );

  const handleClose = () => {
    emit('update:visible', false);
    formModel.value = { username: '' };
  };

  const handleSave = () => {
    const equalForm = isEqual(formModel.value, originalFormModel.value);
    const equalPermission = isEqual(
      userPermissions.value,
      originalUserPermissions.value
    );
    const equalRole = isEqual(userRoles.value, originalUserRoles.value);
    if (equalForm && equalPermission && equalRole) {
      // 数据没有改变，不调用接口
      handleClose();
      return;
    }

    switch (props.mode) {
      case 'add':
        emit('add', formModel.value, userPermissions.value, userRoles.value);
        break;
      case 'edit':
        emit(
          'edit',
          formModel.value,
          userPermissions.value,
          userRoles.value,
          equalForm,
          equalPermission,
          equalRole
        );
        break;
      default:
        handleClose();
        break;
    }
  };

  const isDetailMode = computed(() => props.mode === 'detail');
</script>
