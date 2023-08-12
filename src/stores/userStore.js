import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { EMS_ACCESS_TOKEN, EMS_EXPIRES_AT, EMS_REFRESH_TOKEN, EMS_ROLES } from '../constants/auth';

export const useUserStore = defineStore('user', () => {
  const accessToken = ref();
  const refreshToken = ref();
  const roles = ref();
  const expiresAt = ref();
  const user = ref();

  const getAccessToken = computed(() => {
    const localStorageAccessToken = localStorage.getItem(EMS_ACCESS_TOKEN);
    return accessToken.value ?? localStorageAccessToken;
  });

  const getRefreshToken = computed(() => {
    const localStorageRefreshToken = localStorage.getItem(EMS_REFRESH_TOKEN);
    return refreshToken.value ?? localStorageRefreshToken;
  });

  const getExpiresAt = computed(() => {
    const localStorageExpiresAt = localStorage.getItem(EMS_EXPIRES_AT);
    return expiresAt.value ?? localStorageExpiresAt;
  });

  const getRoles = computed(() => {
    const localStorageRoles = JSON.parse(localStorage.getItem(EMS_ROLES));
    return roles.value ?? localStorageRoles;
  });

  const cleanup = () => {
    accessToken.value = null;
    refreshToken.value = null;
    expiresAt.value = null;
    roles.value = null;

    localStorage.removeItem(EMS_ACCESS_TOKEN);
    localStorage.removeItem(EMS_REFRESH_TOKEN);
    localStorage.removeItem(EMS_EXPIRES_AT);
    localStorage.removeItem(EMS_ROLES);
  };

  const set = (accessTokenVal, refreshTokenVal, expiresAtVal, rolesVal) => {
    accessToken.value = accessTokenVal;
    refreshToken.value = refreshTokenVal;
    expiresAt.value = expiresAtVal;
    roles.value = rolesVal;

    localStorage.setItem(EMS_ACCESS_TOKEN, accessTokenVal);
    localStorage.setItem(EMS_REFRESH_TOKEN, refreshTokenVal);
    localStorage.setItem(EMS_EXPIRES_AT, expiresAtVal);
    localStorage.setItem(EMS_ROLES, JSON.stringify(rolesVal));
  };

  const isLoggedIn = computed(() => getAccessToken.value ? true : false);
  const hasAuthenticatedUser = computed(() => user.value ? true : false);

  return { cleanup, set, accessToken, refreshToken, roles, expiresAt, user, getAccessToken, getRefreshToken, getExpiresAt, getRoles, isLoggedIn, hasAuthenticatedUser };
});