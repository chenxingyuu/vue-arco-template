<template>
  <div></div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { onMounted } from 'vue';
  import { useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';

  const userStore = useUserStore();
  const router = useRouter();
  const { t } = useI18n();

  onMounted(async () => {
    const { code } = router.currentRoute.value.query;
    if (code) {
      try {
        await userStore.loginByGoogle(code as string);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        await router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
        Message.success(t('login.form.login.success'));
      } catch (error) {
        // 处理错误
        Message.error(t('login.form.login.error'));
      }
    }
  });
</script>
