<template>
  <a-card class="general-card" :title="$t('system.role.title')">
    <role-filter
      @reset="reset"
      @search="search"
      @create="() => openDrawer('add')"
      @changed="changed"
    />
    <a-divider style="margin-top: 0" />
    <a-table
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      :columns="columns"
      :data="roles"
      :stripe="true"
      :bordered="false"
      :size="size"
      @page-change="onPageChange"
    >
      <template #created_at="{ record }">
        {{ formatDate(record.created_at) }}
      </template>
      <template #operations="{ record }">
        <a-button
          v-Role="['system:role:read']"
          type="text"
          size="small"
          @click="() => openDrawer('detail', record)"
        >
          {{ $t('system.role.table.columns.operations.view') }}
        </a-button>
        <a-button
          v-Role="['system:role:update']"
          type="text"
          size="small"
          style="margin-left: 8px"
          @click="() => openDrawer('edit', record)"
        >
          {{ $t('system.role.table.columns.operations.edit') }}
        </a-button>
      </template>
    </a-table>
    <role-detail
      :visible="drawerVisible"
      :title="drawerTitle"
      :mode="drawerMode"
      :role-id="selectedRoleID"
      :initial-form-model="selectedRole"
      @update:visible="(val) => (drawerVisible = val)"
      @add="addRole"
      @edit="editRole"
    />
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, computed, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    createRole,
    getRoleList,
    updateRole,
    updateRolePermissions,
  } from '@/api/system/roles';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import useLoading from '@/hooks/loading';
  import { formatDate } from '@/utils/date';
  import RoleFilter from '@/views/system/role/components/role-filter.vue';
  import RoleDetail from '@/views/system/role/components/role-detail.vue';
  import { Role, RoleQueryParams } from '@/api/system/types';

  const drawerVisible = ref(false);
  const drawerTitle = ref('');
  const drawerMode = ref<'add' | 'edit' | 'detail'>('add');
  const selectedRoleID = ref(0);
  const selectedRole = ref<Pick<Role, 'name' | 'description'>>({
    name: '',
    description: '',
  });

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const roles = ref<Role[]>([]);
  const formModel = reactive({
    name: '',
    description: '',
  });
  const size = ref<SizeProps>('medium');
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('system.role.table.columns.id'),
      dataIndex: 'id',
      width: 80,
    },
    {
      title: t('system.role.table.columns.name'),
      dataIndex: 'name',
      width: 200,
    },
    {
      title: t('system.role.table.columns.description'),
      dataIndex: 'description',
    },
    {
      title: t('system.role.table.columns.createdAt'),
      dataIndex: 'created_at',
      slotName: 'created_at',
      width: 250,
    },
    {
      title: t('system.role.table.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 250,
    },
  ]);
  const basePagination: RoleQueryParams = {
    page: 1,
    limit: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });

  const fetchData = async (params: RoleQueryParams = pagination) => {
    setLoading(true);
    try {
      const { data } = await getRoleList(params);
      roles.value = data.list;
      pagination.page = data.page;
      pagination.total = data.total;
    } catch (err) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel,
    } as unknown as RoleQueryParams);
  };

  const onPageChange = (page: number) => {
    fetchData({ ...basePagination, page });
  };
  const reset = () => {
    formModel.name = '';
    formModel.description = '';
  };

  const changed = (newFormModel: { name: string; description: string }) => {
    formModel.name = newFormModel.name;
    formModel.description = newFormModel.description;
  };

  const addRole = async (role: Role, permissions: string[]) => {
    try {
      const { data } = await createRole({
        name: role.name,
        description: role.description,
      });
      if (permissions) {
        await updateRolePermissions(
          data.id,
          permissions.map((str) => Number(str))
        );
      }

      // Refresh or handle after save
      drawerVisible.value = false;
      await fetchData();
    } catch (err) {
      // Handle error
    }
  };

  const editRole = async (
    role: Role,
    permissions: string[],
    equalForm: boolean,
    equalPermission: boolean
  ) => {
    try {
      if (!equalForm) {
        await updateRole(role.id, {
          name: role.name,
          description: role.description,
        });
      }
      if (!equalPermission) {
        await updateRolePermissions(
          role.id,
          permissions.map((str) => Number(str))
        );
      }
      // Refresh or handle after save
      drawerVisible.value = false;
      await fetchData();
    } catch (err) {
      // Handle error
    }
  };

  const openDrawer = (mode: 'add' | 'edit' | 'detail', role?: Role) => {
    drawerMode.value = mode;

    // eslint-disable-next-line default-case
    switch (mode) {
      case 'add':
        drawerTitle.value = t(
          'system.role.table.columns.operations.create.title'
        );
        break;
      case 'detail':
        drawerTitle.value = t(
          'system.role.table.columns.operations.view.title'
        );
        break;
      case 'edit':
        drawerTitle.value = t(
          'system.role.table.columns.operations.edit.title'
        );
        break;
    }
    selectedRoleID.value = role ? role.id : 0;
    selectedRole.value = role ? { ...role } : { name: '', description: '' };
    drawerVisible.value = true;
  };
</script>

<style scoped>
  /* Add any custom styles here */
</style>
