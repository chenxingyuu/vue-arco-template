import { defineStore } from 'pinia';
import {
  logout as userLogout,
  githubAuthorizer,
  login as userLogin,
  googleAuthorizer,
} from '@/api/system/auth';
import {
  setToken,
  clearToken,
  setScopes,
  clearScopes,
  getScopes,
} from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { AuthRes, LoginData } from '@/api/system/types';
import { getUserInfo } from '@/api/user';
import { UserState } from './types';

// Helper functions
async function handleLoginSuccess(data: AuthRes) {
  setToken(`${data.token_type} ${data.access_token}`);
  setScopes(data.scopes);
}

async function handleLoginError() {
  clearToken();
  clearScopes();
}

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
        await handleLoginSuccess(data);
        await this.setPermissions(data.scopes);
      } catch (err) {
        await handleLoginError();
        await this.clearPermissions();
        throw err;
      }
    },
    async loginByGithub(code: string) {
      try {
        const { data } = await githubAuthorizer({ code });
        await handleLoginSuccess(data);
        await this.setPermissions(data.scopes);
      } catch (err) {
        await handleLoginError();
        await this.clearPermissions();
        throw err;
      }
    },
    async loginByGoogle(code: string) {
      try {
        const { data } = await googleAuthorizer({ code });
        await handleLoginSuccess(data);
        await this.setPermissions(data.scopes);
      } catch (err) {
        await handleLoginError();
        await this.clearPermissions();
        throw err;
      }
    },
    logoutCallBack() {
      this.resetInfo();
      clearToken();
      clearScopes();
      removeRouteListener();
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
