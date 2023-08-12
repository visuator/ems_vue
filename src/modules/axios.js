import axiosInstance from 'axios'
import { useUserStore } from '../stores/userStore';
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
                refreshToken: userStore.getRefreshToken,
            }, {
                params: {
                    requestedAt: new Date(Date.now()),
                },
                headers: {
                    Authorization: `Bearer ${userStore.getAccessToken}`
                }
            }).then(val => {
                userStore.set(val.data.accessToken, val.data.refreshToken, val.data.expiresAt, val.data.roles);
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
        userStore.cleanup();
        toast.warning('Сессия истекла');
        router.push('/login');
    }
    else if (error.response.status === 500) {
        toast.error('Произошла ошибка на сервере');
    }

    return Promise.reject(error);
});

export default axios;