<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';
import { EMS_ACCESS_TOKEN, EMS_EXPIRES_AT, EMS_REFRESH_TOKEN, EMS_ROLES } from '../constants/auth';
import { NAVS_BY_ROLES } from '../constants/navs';
import axios from '../modules/axios';
import router from '../router/router';

const userStore = useUserStore();
const navs = computed(() => {
    const filteredNavs = NAVS_BY_ROLES.filter(x => x.roles.some(r => userStore.getRoles?.some(sr => sr === r)));
    if(!filteredNavs){
        // return ...
    }
    return filteredNavs;
});

onMounted(async () => {
    await axios.get('accounts/authenticated').then(val => {
        userStore.user = val.data;
        return val;
    })
});
const handleLogout = () => {
    userStore.accessToken = null;
    userStore.refreshToken = null;
    userStore.expiresAt = null;
    userStore.roles = null;
    userStore.user = null;

    localStorage.removeItem(EMS_ACCESS_TOKEN);
    localStorage.removeItem(EMS_REFRESH_TOKEN);
    localStorage.removeItem(EMS_EXPIRES_AT);
    localStorage.removeItem(EMS_ROLES);

    router.push('/login');
}
</script>
<template>
    <template v-if="navs?.length">
        <nav class="navbar navbar-expand-lg navbar-light bg-light" style="margin-bottom: 4rem;">
        <div class="container-fluid">
            <span class="navbar-brand" href="#">EMS</span>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Раскрыть меню">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item" v-for="nav in navs" :key="nav.id">
                        <router-link class="nav-link active" aria-current="page" :to="nav.to">{{ nav.name }}</router-link>
                    </li>
                </ul>
                <router-link class="ms-auto nav-link active link-primary" aria-current="page" to="/lk">{{ userStore.hasAuthenticatedUser ? userStore.user.email : '&mdash;' }}</router-link>
                <i class="ms-2 bi bi-door-open" @click="handleLogout"></i>
            </div>
        </div>
    </nav>
    <router-view></router-view>
    </template>
    <template v-else>
        <div class="alert alert-warning">У вас нет доступа к системе</div>
    </template>
</template>