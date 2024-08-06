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
      <a-form-item field="name" :label="$t('system.permission.form.name')">
        <a-input
          v-model="formModel.name"
          :placeholder="$t('system.permission.form.name.placeholder')"
          :readonly="isDetailMode"
        />
      </a-form-item>
      <a-form-item
        field="description"
        :label="$t('system.permission.form.description')"
      >
        <a-input
          v-model="formModel.description"
          :placeholder="$t('system.permission.form.description.placeholder')"
          :readonly="isDetailMode"
        />
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
  import { ref, defineProps, defineEmits, watch, computed } from 'vue';

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
    initialFormModel: {
      type: Object as () => { name: string; description: string },
      default: () => ({ name: '', description: '' }),
    },
  });

  const emit = defineEmits(['update:visible', 'add', 'edit']);

  const formModel = ref({ ...props.initialFormModel });

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
    switch (props.mode) {
      case 'add':
        emit('add', formModel.value);
        break;
      case 'edit':
        emit('edit', formModel.value);
        break;
      default:
        break;
    }
  };

  const isDetailMode = computed(() => props.mode === 'detail');
</script>
