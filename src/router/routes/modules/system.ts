import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SYSTEM: AppRouteRecordRaw = {
  path: '/system',
  name: 'system',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.system',
    requiresAuth: true,
    icon: 'icon-menu',
    order: 5,
  },
  children: [
    {
      path: 'users',
      name: 'Users',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        locale: 'menu.system.user',
        requiresAuth: true,
        icon: 'icon-user',
        roles: ['*'],
      },
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        locale: 'menu.system.role',
        requiresAuth: true,
        icon: 'icon-skin',
        roles: ['admin'],
      },
    },
    {
      path: 'permission',
      name: 'Permission',
      component: () => import('@/views/system/permission/index.vue'),
      meta: {
        locale: 'menu.system.permission',
        requiresAuth: true,
        icon: 'icon-safe',
        roles: ['admin'],
      },
    },
  ],
};

export default SYSTEM;
