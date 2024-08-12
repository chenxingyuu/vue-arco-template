import { PaginationParams } from '@/types/global';

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface RoleQueryParams extends PaginationParams {
  name?: string;
  description?: string;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface PermissionQueryParams extends PaginationParams {
  name?: string;
  description?: string;
}

export interface User {
  id: number;
  username: string;
}

export interface UserQueryParams extends PaginationParams {
  username?: string;
  description?: string;
}
