import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();

    const redirectToLogin = () => {
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    };

    if (isLogin()) {
      try {
        if (!userStore.role) {
          await userStore.info();
        }
        next();
      } catch (error) {
        await userStore.logout();
        redirectToLogin();
      }
    } else if (to.name === 'login' || to.name === 'github') {
      next();
    } else {
      redirectToLogin();
    }
    NProgress.done();
  });
}
