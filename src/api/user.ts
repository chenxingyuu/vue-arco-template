import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { Permission, UserState } from '@/store/modules/user/types';

export function getUserInfo() {
  return axios.get<UserState>('/users/me');
}

export function getUserMePermissions() {
  return axios.get<Permission[]>('/users/me/permissions');
}

export function getUserRoles() {
  return axios.get<UserState>('/users/me/roles');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}
