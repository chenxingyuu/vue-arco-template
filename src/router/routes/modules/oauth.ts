import { AppRouteRecordRaw } from '../types';

const CALLBACK: AppRouteRecordRaw = {
  path: '/auth/github',
  name: 'Github',
  meta: {
    requiresAuth: false,
  },
  component: () => import('@/views/oauth/github.vue'),
};

export default CALLBACK;
