const TOKEN_KEY = 'token';
const SCOPES_KEY = 'scopes';

const isLogin = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const setScopes = (scopes: string[]) => {
  localStorage.setItem(SCOPES_KEY, scopes.join(','));
};

const clearScopes = () => {
  localStorage.removeItem(SCOPES_KEY);
};

export { isLogin, getToken, setToken, clearToken, setScopes, clearScopes };
