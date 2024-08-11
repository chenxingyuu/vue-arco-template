<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.role']" />
    <div class="layout">
      <RoleManager> </RoleManager>
    </div>
  </div>
</template>

<script setup lang="ts">
  import RoleManager from '@/views/system/role/components/role-manager.vue';
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
