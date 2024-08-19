import axios from 'axios';
import { PaginatedResponse } from '@/types/global';
import { Permission, PermissionQueryParams } from '@/api/system/types';

export async function getPermissionList(params: PermissionQueryParams) {
  return axios.get<PaginatedResponse<Permission>>('/permissions', { params });
}

export async function getPermissionDetail() {
  return axios.get<Permission>('/permissions');
}

export async function createPermission(
  permission: Pick<Permission, 'name' | 'description'>
) {
  return axios.post('/permissions', permission);
}

export async function updatePermission(
  id: number,
  permission: Pick<Permission, 'name' | 'description'>
) {
  return axios.put(`/permissions/${id}`, permission);
}

export async function partialUpdatePermission(
  id: number,
  permission: Partial<Permission>
) {
  return axios.patch(`/permissions/${id}`, permission);
}

export async function deletePermission(id: number) {
  return axios.delete(`/permissions/${id}`);
}

export async function getAllPermission() {
  return axios.get<Permission[]>('/permissions/all');
}
