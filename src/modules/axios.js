import axiosInstance from 'axios'
import { useUserStore } from '../stores/userStore';
import { EMS_ACCESS_TOKEN, EMS_REFRESH_TOKEN, EMS_ROLES, EMS_EXPIRES_AT } from '../constants/auth'
import toast from '../modules/toast';
import router from '../router/router';

const axios = axiosInstance.create({
    baseURL: import.meta.env.VITE_API_URL,
});
const defaultAxios = axiosInstance.create({
    baseURL: import.meta.env.VITE_API_URL,
});
defaultAxios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response.status === 500) {
        toast.error('Произошла ошибка на сервере');
    }
    return Promise.reject(error);
});

axios.interceptors.request.use(async (request) => {
    const userStore = useUserStore();
    if (userStore.getAccessToken) {
        const isExpired = new Date(userStore.getExpiresAt).getTime() - Date.now() <= 0;
        if (isExpired) {
            await defaultAxios.post('auth/refresh', {
                refreshToken: userStore.getRefreshToken
            }, {
                headers: {
                    Authorization: `Bearer ${userStore.getAccessToken}`
                }
            }).then(val => {
                userStore.accessToken = val.data.accessToken;
                userStore.roles = val.data.roles;
                userStore.refreshToken = val.data.refreshToken;
                userStore.expiresAt = val.data.expiresAt;

                localStorage.setItem(EMS_ACCESS_TOKEN, val.data.accessToken);
                localStorage.setItem(EMS_REFRESH_TOKEN, val.data.refreshToken);
                localStorage.setItem(EMS_EXPIRES_AT, val.data.expiresAt);
                localStorage.setItem(EMS_ROLES, JSON.stringify(val.data.roles));
            });
        }
        request.headers.Authorization = `Bearer ${userStore.getAccessToken}`;
    }
    return request;
});
axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const userStore = useUserStore();

    if (error.response.status === 401) {
        userStore.accessToken = null;
        userStore.refreshToken = null;
        userStore.expiresAt = null;
        userStore.roles = null;

        localStorage.removeItem(EMS_ACCESS_TOKEN);
        localStorage.removeItem(EMS_REFRESH_TOKEN);
        localStorage.removeItem(EMS_EXPIRES_AT);
        localStorage.removeItem(EMS_ROLES);

        toast.warning('Сессия истекла');
        router.push('/login');
    }
    else if (error.response.status === 500) {
        toast.error('Произошла ошибка на сервере');
    }
    
    return Promise.reject(error);
});

export default axios;