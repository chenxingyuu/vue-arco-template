import axios from 'axios';
import { PaginatedResponse } from '@/types/global';
import { User, Permission, UserQueryParams, Role } from '@/api/system/types';

export function getUserList(params: UserQueryParams) {
  return axios.get<PaginatedResponse<User>>('/users', { params });
}

export function getUserDetail() {
  return axios.get<User>('/users');
}

export async function createUser(user: Pick<User, 'username'>) {
  return axios.post<User>('/users', user);
}

export async function updateUser(id: number, role: Pick<User, 'username'>) {
  return axios.put(`/users/${id}`, role);
}

export async function partialUpdateUser(id: number, role: Partial<User>) {
  return axios.patch(`/users/${id}`, role);
}

export async function deleteUser(id: number) {
  return axios.delete(`/users/${id}`);
}

export async function getUserPermissions(id: number) {
  return axios.get<Permission[]>(`/users/${id}/permissions`);
}

export async function getUserRoles(id: number) {
  return axios.get<Role[]>(`/users/${id}/roles`);
}

export async function updateUserPermissions(
  id: number,
  permissionIds: number[]
) {
  return axios.put(`/users/${id}/permissions`, permissionIds);
}

export async function updateUserRoles(id: number, roleIds: number[]) {
  return axios.put(`/users/${id}/roles`, roleIds);
}
