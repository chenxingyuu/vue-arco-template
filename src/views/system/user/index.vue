<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.user']" />
    <div class="layout">
      <user-manager> </user-manager>
    </div>
  </div>
</template>

<script setup lang="ts">
  import UserManager from '@/views/system/user/components/user-manager.vue';
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
