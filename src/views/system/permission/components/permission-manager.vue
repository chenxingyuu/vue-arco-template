<template>
  <a-card class="general-card" :title="$t('system.permission.title')">
    <permission-filter
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
      :data="permissions"
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
          v-permission="['admin']"
          type="text"
          size="small"
          @click="() => openDrawer('detail', record)"
        >
          {{ $t('system.permission.table.columns.operations.view') }}
        </a-button>
        <a-button
          v-permission="['admin']"
          type="text"
          size="small"
          style="margin-left: 8px"
          @click="() => openDrawer('edit', record)"
        >
          {{ $t('system.permission.table.columns.operations.edit') }}
        </a-button>
      </template>
    </a-table>
    <permission-detail
      :visible="drawerVisible"
      :title="drawerTitle"
      :mode="drawerMode"
      :initial-form-model="selectedPermission"
      @update:visible="(val) => (drawerVisible = val)"
      @add="addPermission"
      @edit="editPermission"
    />
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, computed, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    createPermission,
    getPermissionList,
    updatePermission,
    Permission,
    PermissionQueryParams,
  } from '@/api/system/permissions';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import useLoading from '@/hooks/loading';
  import { formatDate } from '@/utils/date';
  import PermissionFilter from '@/views/system/permission/components/permission-filter.vue';
  import PermissionDetail from '@/views/system/permission/components/permission-detail.vue';

  const drawerVisible = ref(false);
  const drawerTitle = ref('');
  const drawerMode = ref<'add' | 'edit' | 'detail'>('add');
  const selectedPermission = ref<Pick<Permission, 'name' | 'description'>>({
    name: '',
    description: '',
  });

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const permissions = ref<Permission[]>([]);
  const formModel = reactive({
    name: '',
    description: '',
  });
  const size = ref<SizeProps>('medium');
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('system.permission.table.columns.id'),
      dataIndex: 'id',
      width: 80,
      minWidth: 80,
    },
    {
      title: t('system.permission.table.columns.name'),
      dataIndex: 'name',
      width: 200,
      minWidth: 100,
    },
    {
      title: t('system.permission.table.columns.description'),
      dataIndex: 'description',
    },
    {
      title: t('system.permission.table.columns.createdAt'),
      dataIndex: 'created_at',
      slotName: 'created_at',
      width: 250,
      minWidth: 200,
    },
    {
      title: t('system.permission.table.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      width: 250,
      minWidth: 100,
    },
  ]);
  const basePagination: PermissionQueryParams = {
    page: 1,
    limit: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });

  const fetchData = async (params: PermissionQueryParams = pagination) => {
    setLoading(true);
    try {
      const { data } = await getPermissionList(params);
      permissions.value = data.list;
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
    } as unknown as PermissionQueryParams);
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

  const addPermission = async (permission: Permission) => {
    try {
      await createPermission({
        name: permission.name,
        description: permission.description,
      });
      // Refresh or handle after save
      drawerVisible.value = false;
      await fetchData();
    } catch (err) {
      // Handle error
    }
  };

  const editPermission = async (permission: Permission) => {
    try {
      await updatePermission(permission.id, {
        name: permission.name,
        description: permission.description,
      });
      // Refresh or handle after save
      drawerVisible.value = false;
      await fetchData();
    } catch (err) {
      // Handle error
    }
  };

  const openDrawer = (
    mode: 'add' | 'edit' | 'detail',
    permission?: Permission
  ) => {
    drawerMode.value = mode;

    // eslint-disable-next-line default-case
    switch (mode) {
      case 'add':
        drawerTitle.value = '新增权限';
        break;
      case 'detail':
        drawerTitle.value = '权限详情';
        break;
      case 'edit':
        drawerTitle.value = '编辑权限';
        break;
    }

    selectedPermission.value = permission
      ? { ...permission }
      : { name: '', description: '' };
    drawerVisible.value = true;
  };
</script>

<style scoped>
  /* Add any custom styles here */
</style>
