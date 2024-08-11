import axios from 'axios';
import { PaginatedResponse } from '@/types/global';
import { Permission, PermissionQueryParams } from '@/api/system/types';

export function getPermissionList(params: PermissionQueryParams) {
  return axios.get<PaginatedResponse<Permission>>('/permissions', { params });
}

export function getPermissionDetail() {
  return axios.get<Permission>('/permissions');
}

export async function createPermission(
  permission: Pick<Permission, 'name' | 'description'>
) {
  return axios.post('/permissions', permission);
}

export function updatePermission(
  id: number,
  permission: Pick<Permission, 'name' | 'description'>
) {
  return axios.put(`/permissions/${id}`, permission);
}

export function partialUpdatePermission(
  id: number,
  permission: Partial<Permission>
) {
  return axios.patch(`/permissions/${id}`, permission);
}

export function deletePermission(id: number) {
  return axios.delete(`/permissions/${id}`);
}

export function getAllPermission() {
  return axios.get<Permission>('/permissions/all');
}
