import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
  getUserPermissions,
} from '@/api/user';
import {
  setToken,
  clearToken,
  setScopes,
  clearScopes,
  getScopes,
} from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: undefined,
    avatar: undefined,
    job: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: '',
    permissions: [],
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },
  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },

    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    setPermissions(permissions: string[]) {
      return new Promise((resolve) => {
        this.permissions = permissions;
        resolve(this.permissions);
      });
    },

    clearPermissions() {
      return new Promise((resolve) => {
        this.permissions = [];
        resolve(this.permissions);
      });
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const { data } = await getUserInfo();
      data.permissions = getScopes();
      this.setInfo(data);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const { data } = await userLogin(loginForm);
        setToken(`${data.token_type} ${data.access_token}`);
        setScopes(data.scopes);
        await this.setPermissions(data.scopes);
      } catch (err) {
        clearToken();
        clearScopes();
        await this.clearPermissions();
        throw err;
      }
    },

    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      clearScopes();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
