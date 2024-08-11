import axios from 'axios';
import { PaginatedResponse } from '@/types/global';
import { Role, Permission, RoleQueryParams } from '@/api/system/types';

export function getRoleList(params: RoleQueryParams) {
  return axios.get<PaginatedResponse<Role>>('/roles', { params });
}

export function getRoleDetail() {
  return axios.get<Role>('/roles');
}

export async function createRole(role: Pick<Role, 'name' | 'description'>) {
  return axios.post('/roles', role);
}

export function updateRole(
  id: number,
  role: Pick<Role, 'name' | 'description'>
) {
  return axios.put(`/roles/${id}`, role);
}

export function partialUpdateRole(id: number, role: Partial<Role>) {
  return axios.patch(`/roles/${id}`, role);
}

export function deleteRole(id: number) {
  return axios.delete(`/roles/${id}`);
}

export function getRolePermissions(id: number) {
  return axios.get<Permission[]>(`/roles/${id}/permissions`);
}
