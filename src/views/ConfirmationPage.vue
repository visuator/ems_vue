<script setup>
import router from '../router/router'
import toast from '../modules/toast'
import axios from '../modules/axios'
import { onMounted, computed } from 'vue'
import { useUserStore } from '../stores/userStore';

const confirmationToken = computed(() => router.currentRoute.value.query.confirmationToken);
onMounted(async () => {
    await axios.post('auth/confirm', {
        confirmationToken: confirmationToken.value,
        requestedAt: new Date(Date.now()).toJSON(),
    }).then(val => {
        const userStore = useUserStore();
        
        if (userStore.isLoggedIn) {
            userStore.cleanup();
        }
        router.push('/login');
        toast.success('Аккаунт подтвержден');
        return val;
    });
});
</script>
<template>
    <div></div>
</template>