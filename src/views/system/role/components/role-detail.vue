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
      <a-form-item field="name" :label="$t('system.role.form.name')">
        <a-input
          v-model="formModel.name"
          :placeholder="$t('system.role.form.name.placeholder')"
          :readonly="isDetailMode"
        />
      </a-form-item>
      <a-form-item
        field="description"
        :label="$t('system.role.form.description')"
      >
        <a-input
          v-model="formModel.description"
          :placeholder="$t('system.role.form.description.placeholder')"
          :readonly="isDetailMode"
        />
      </a-form-item>
      <a-form-item
        field="permissions"
        :label="$t('system.role.form.permissions')"
      >
        <a-spin v-if="loading" />
        <a-transfer
          v-else
          :title="['所有', '当前']"
          :data="allPermissions"
          :default-value="rolePermissions"
          @change="handleChange"
        >
        </a-transfer>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
  import { ref, defineProps, defineEmits, watch, computed } from 'vue';
  import { getRolePermissions } from '@/api/system/roles';
  import { TransferItem } from '@arco-design/web-vue/es/transfer/interface';
  import { getAllPermission } from '@/api/system/permissions';
  import useLoading from '@/hooks/loading';
  import { isEqual } from 'lodash';

  const { loading, setLoading } = useLoading(false);
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
    roleId: {
      type: Number,
      default: 0,
    },
    initialFormModel: {
      type: Object as () => { name: string; description: string },
      default: () => ({ name: '', description: '' }),
    },
  });

  const emit = defineEmits(['update:visible', 'add', 'edit']);

  const formModel = ref({ ...props.initialFormModel });
  const originalFormModel = ref({ ...props.initialFormModel }); // 保存初始状态

  const allPermissions = ref<TransferItem[]>([]);
  const rolePermissions = ref<string[]>([]);
  const originalRolePermissions = ref<string[]>([]); // 保存初始状态

  const fetAllPermissions = async () => {
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

  fetAllPermissions();

  const fetchRolePermission = async () => {
    try {
      setLoading(true);
      const { data } = await getRolePermissions(props.roleId);
      // 将返回的数据转换为 a-transfer 组件需要的格式
      rolePermissions.value = data.map((permission) => `${permission.id}`);
      originalRolePermissions.value = [...rolePermissions.value]; // 保存初始状态
    } catch (err) {
      // Handle error
    } finally {
      // finally
      setLoading(false);
    }
  };

  // 处理 a-transfer 中选中的项变化
  const handleChange = (newTargetKeys: string[]) => {
    rolePermissions.value = newTargetKeys;
    // 这里的 newTargetKeys 是用户当前选中的项的 key 列表
    // 你可以在这里添加其他逻辑，例如保存选中的权限到服务器
  };

  watch(
    () => props.visible,
    () => {
      if (props.visible === true) {
        if (props.roleId !== 0) {
          fetchRolePermission();
        }
        originalFormModel.value = { ...props.initialFormModel }; // 保存初始状态
      } else {
        rolePermissions.value = [];
        originalRolePermissions.value = [...rolePermissions.value];
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
    formModel.value = { name: '', description: '' };
  };

  const handleSave = () => {
    const equalForm = isEqual(formModel.value, originalFormModel.value);
    const equalPermission = isEqual(
      rolePermissions.value,
      originalRolePermissions.value
    );
    if (equalForm && equalPermission) {
      // 数据没有改变，不调用接口
      handleClose();
      return;
    }

    switch (props.mode) {
      case 'add':
        emit('add', formModel.value, rolePermissions.value);
        break;
      case 'edit':
        emit(
          'edit',
          formModel.value,
          rolePermissions.value,
          equalForm,
          equalPermission
        );
        break;
      default:
        handleClose();
        break;
    }
  };

  const isDetailMode = computed(() => props.mode === 'detail');
</script>
