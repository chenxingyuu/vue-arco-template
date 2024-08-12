<template>
  <a-card class="general-card" :title="$t('system.user.title')">
    <user-filter
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
      :data="users"
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
          v-Role="['system:user:read']"
          type="text"
          size="small"
          @click="() => openDrawer('detail', record)"
        >
          {{ $t('system.user.table.columns.operations.view') }}
        </a-button>
        <a-button
          v-Role="['system:user:update']"
          type="text"
          size="small"
          style="margin-left: 8px"
          @click="() => openDrawer('edit', record)"
        >
          {{ $t('system.user.table.columns.operations.edit') }}
        </a-button>
      </template>
    </a-table>
    <user-detail
      :visible="drawerVisible"
      :title="drawerTitle"
      :mode="drawerMode"
      :user-id="selectedUserID"
      :initial-form-model="selectedUser"
      @update:visible="(val) => (drawerVisible = val)"
      @add="addUser"
      @edit="editUser"
    />
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, computed, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    createUser,
    getUserList,
    updateUser,
    updateUserPermissions,
    updateUserRoles,
  } from '@/api/system/users';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import useLoading from '@/hooks/loading';
  import { formatDate } from '@/utils/date';
  import UserFilter from '@/views/system/user/components/user-filter.vue';
  import UserDetail from '@/views/system/user/components/user-detail.vue';
  import { User, UserQueryParams } from '@/api/system/types';

  const drawerVisible = ref(false);
  const drawerTitle = ref('');
  const drawerMode = ref<'add' | 'edit' | 'detail'>('add');
  const selectedUserID = ref(0);
  const selectedUser = ref<Pick<User, 'username'>>({
    username: '',
  });

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const users = ref<User[]>([]);
  const formModel = reactive({
    username: '',
    description: '',
  });
  const size = ref<SizeProps>('medium');
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('system.user.table.columns.id'),
      dataIndex: 'id',
      width: 80,
    },
    {
      title: t('system.user.table.columns.username'),
      dataIndex: 'username',
      width: 200,
    },
    {
      title: t('system.user.table.columns.description'),
      dataIndex: 'description',
    },
    {
      title: t('system.user.table.columns.createdAt'),
      dataIndex: 'created_at',
      slotName: 'created_at',
      width: 250,
    },
    {
      title: t('system.user.table.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 250,
    },
  ]);
  const basePagination: UserQueryParams = {
    page: 1,
    limit: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });

  const fetchData = async (params: UserQueryParams = pagination) => {
    setLoading(true);
    try {
      const { data } = await getUserList(params);
      users.value = data.list;
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
    } as unknown as UserQueryParams);
  };

  const onPageChange = (page: number) => {
    fetchData({ ...basePagination, page });
  };
  const reset = () => {
    formModel.username = '';
    formModel.description = '';
  };

  const changed = (newFormModel: { username: string; description: string }) => {
    formModel.username = newFormModel.username;
    formModel.description = newFormModel.description;
  };

  const addUser = async (
    user: User,
    permissions: string[],
    roles: string[]
  ) => {
    try {
      const { data } = await createUser({
        username: user.username,
      });
      await updateUserPermissions(
        data.id,
        permissions.map((str) => Number(str))
      );
      await updateUserRoles(
        data.id,
        roles.map((str) => Number(str))
      );
      // Refresh or handle after save
      drawerVisible.value = false;
      await fetchData();
    } catch (err) {
      // Handle error
    }
  };

  const editUser = async (
    user: User,
    permissions: string[],
    roles: string[],
    equalForm: boolean,
    equalPermission: boolean,
    equalRole: boolean
  ) => {
    try {
      if (!equalForm) {
        await updateUser(user.id, {
          username: user.username,
        });
      }
      if (!equalPermission) {
        await updateUserPermissions(
          user.id,
          permissions.map((str) => Number(str))
        );
      }
      if (!equalRole) {
        await updateUserRoles(
          user.id,
          roles.map((str) => Number(str))
        );
      }

      // Refresh or handle after save
      drawerVisible.value = false;
      await fetchData();
    } catch (err) {
      // Handle error
    }
  };

  const openDrawer = (mode: 'add' | 'edit' | 'detail', user?: User) => {
    drawerMode.value = mode;

    // eslint-disable-next-line default-case
    switch (mode) {
      case 'add':
        drawerTitle.value = t(
          'system.user.table.columns.operations.create.title'
        );
        break;
      case 'detail':
        drawerTitle.value = t(
          'system.user.table.columns.operations.view.title'
        );
        break;
      case 'edit':
        drawerTitle.value = t(
          'system.user.table.columns.operations.edit.title'
        );
        break;
    }
    selectedUserID.value = user ? user.id : 0;
    selectedUser.value = user ? { ...user } : { username: '' };
    drawerVisible.value = true;
  };
</script>

<style scoped>
  /* Add any custom styles here */
</style>
