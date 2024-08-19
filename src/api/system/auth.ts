import axios from 'axios';
import {
  AuthRes,
  GithubAuthorizeRequest,
  GoogleAuthorizeRequest,
  LoginData,
} from '@/api/system/types';

export async function login(data: LoginData) {
  const params = new URLSearchParams();
  params.append('username', data.username);
  params.append('password', data.password);
  return axios.post<AuthRes>('/auth/password', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

// TODO 实现接口
export function logout() {
  return axios.post<AuthRes>('/auth/logout');
}

export async function githubAuthorizer(data: GithubAuthorizeRequest) {
  return axios.post<AuthRes>('/auth/oauth2/github', data);
}

export async function googleAuthorizer(data: GoogleAuthorizeRequest) {
  return axios.post<AuthRes>('/auth/oauth2/google', data);
}
