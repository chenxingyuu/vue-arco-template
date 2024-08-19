import { PaginationParams } from '@/types/global';

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthRes {
  access_token: string;
  token_type: string;
  scopes: string[];
}

export interface GithubAuthorizeRequest {
  code: string;
}

export interface GoogleAuthorizeRequest {
  code: string;
}

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
