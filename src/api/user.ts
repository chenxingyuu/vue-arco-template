import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { Permission, UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  access_token: string;
  token_type: string;
  scopes: string[];
}

export function login(data: LoginData) {
  const params = new URLSearchParams();
  params.append('username', data.username);
  params.append('password', data.password);
  return axios.post<LoginRes>('/auth/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

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
