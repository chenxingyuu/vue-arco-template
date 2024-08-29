<template>
  <a-card class="general-card" :title="$t('system.menu.title')">
    <a-divider style="margin-top: 0" />
    <a-table
      row-key="id"
      :show-header="false"
      :loading="loading"
      :columns="columns"
      :pagination="false"
      :data="menus"
      :bordered="false"
      :size="size"
      :hide-expand-button-on-empty="true"
      :default-expand-all-rows="true"
      :draggable="{ type: 'handle', fixed: true }"
      :expanded-keys="expandedKeys"
      @page-change="onPageChange"
    >
      <template #locale="{ record }">
        <a-space direction="horizontal" size="medium" style="padding-left: 1em">
          <component
            :is="record.icon"
            v-if="record.icon"
            size="medium"
          ></component>
          <div v-else style="padding: 8px"></div>
          <span>{{ $t(record.locale) }}</span>
        </a-space>
      </template>
      <template #operations="{ record }">
        <a-button
          v-permission="['system:menu:read']"
          type="text"
          size="small"
          @click="() => openDrawer('detail', record)"
        >
          {{ $t('system.menu.table.columns.operations.view') }}
        </a-button>
        <a-button
          v-permission="['system:menu:update']"
          type="text"
          size="small"
          style="margin-left: 8px"
          @click="() => openDrawer('edit', record)"
        >
          {{ $t('system.menu.table.columns.operations.edit') }}
        </a-button>
      </template>
    </a-table>
    <menu-detail
      :visible="drawerVisible"
      :title="drawerTitle"
      :mode="drawerMode"
      :initial-form-model="selectedMenu"
      @update:visible="(val) => (drawerVisible = val)"
      @add="addMenu"
      @edit="editMenu"
    />
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, computed, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    createMenu,
    getMenuListAllTree,
    updateMenu,
  } from '@/api/system/menus';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import useLoading from '@/hooks/loading';
  import { Menu, MenuQueryParams } from '@/api/system/types';
  import MenuDetail from '@/views/system/menu/components/menu-detail.vue';

  const drawerVisible = ref(false);
  const drawerTitle = ref('');
  const drawerMode = ref<'add' | 'edit' | 'detail'>('add');
  const selectedMenu = ref<Pick<Menu, 'name' | 'description'>>({
    name: '',
    description: '',
  });
  const expandedKeys = ref<number[]>([]);

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const menus = ref<Menu[]>([]);

  const size = ref<SizeProps>('medium');
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('system.menu.table.columns.locale'),
      dataIndex: 'locale',
      slotName: 'locale',
      align: 'left',
    },
    {
      title: t('system.menu.table.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 300,
    },
  ]);
  const basePagination: MenuQueryParams = {
    page: 1,
    limit: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });

  const fetchData = async (params: MenuQueryParams = pagination) => {
    setLoading(true);
    try {
      const { data } = await getMenuListAllTree(params);
      menus.value = data;
      expandedKeys.value = data.map((item) => item.id);
    } catch (err) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  const onPageChange = (page: number) => {
    fetchData({ ...basePagination, page });
  };
  const addMenu = async (menu: Menu) => {
    try {
      await createMenu({
        name: menu.name,
        description: menu.description,
      });
      // Refresh or handle after save
      drawerVisible.value = false;
      await fetchData();
    } catch (err) {
      // Handle error
    }
  };

  const editMenu = async (menu: Menu) => {
    try {
      await updateMenu(menu.id, {
        name: menu.name,
        description: menu.description,
      });
      // Refresh or handle after save
      drawerVisible.value = false;
      await fetchData();
    } catch (err) {
      // Handle error
    }
  };

  const openDrawer = (mode: 'add' | 'edit' | 'detail', menu?: Menu) => {
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

    selectedMenu.value = menu ? { ...menu } : { name: '', description: '' };
    drawerVisible.value = true;
  };
</script>

<style scoped>
  /* Add any custom styles here */
</style>
