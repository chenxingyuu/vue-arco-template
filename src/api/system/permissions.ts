import axios from 'axios';
import { PaginationParams, PaginatedResponse } from '@/types/global';

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface PermissionQueryParams extends PaginationParams {
  name?: string;
  description?: string;
}

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
