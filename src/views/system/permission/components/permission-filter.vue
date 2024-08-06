<template>
  <a-row>
    <a-col :flex="1">
      <a-form
        :model="localFormModel"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
        :auto-label-width="true"
        label-align="right"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              field="name"
              :label="$t('system.permission.form.name')"
            >
              <a-input
                v-model="localFormModel.name"
                :placeholder="$t('system.permission.form.name.placeholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              field="description"
              :label="$t('system.permission.form.description')"
            >
              <a-input
                v-model="localFormModel.description"
                :placeholder="
                  $t('system.permission.form.description.placeholder')
                "
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider style="height: 32px" direction="vertical" />
    <a-col :flex="'54px'" style="text-align: right">
      <a-space direction="horizontal" :size="18">
        <a-button @click="onReset">
          <template #icon>
            <icon-refresh />
          </template>
          {{ $t('searchTable.form.reset') }}
        </a-button>
        <a-button type="primary" @click="onSearch">
          <template #icon>
            <icon-search />
          </template>
          {{ $t('searchTable.form.search') }}
        </a-button>
        <a-button type="primary" @click="onCreate">
          <template #icon>
            <icon-plus />
          </template>
          {{ $t('searchTable.operation.create') }}
        </a-button>
      </a-space>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
  import { defineEmits, ref, watch } from 'vue';

  const localFormModel = ref({
    name: '',
    description: '',
  });

  const emit = defineEmits(['reset', 'search', 'create', 'changed']);

  watch(
    () => localFormModel,
    (newValue) => {
      emit('changed', newValue.value);
    },
    { deep: true }
  );
  const onReset = () => {
    emit('reset');
  };

  const onSearch = () => {
    emit('search', localFormModel.value);
  };

  const onCreate = () => {
    emit('create');
  };
</script>
