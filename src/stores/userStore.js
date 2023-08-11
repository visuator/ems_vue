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

  const isLoggedIn = computed(() => getAccessToken.value ? true : false);
  const hasAuthenticatedUser = computed(() => user.value ? true : false);

  return { accessToken, refreshToken, roles, expiresAt, user, getAccessToken, getRefreshToken, getExpiresAt, getRoles, isLoggedIn, hasAuthenticatedUser };
});