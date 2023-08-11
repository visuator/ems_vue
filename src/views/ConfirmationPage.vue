<script setup>
import router from '../router/router'
import toast from '../modules/toast'
import axios from '../modules/axios'
import { onMounted, computed } from 'vue'

const confirmationToken = computed(() => router.currentRoute.value.query.confirmationToken);
onMounted(async () => {
    await axios.post('auth/confirm', {
        confirmationToken: confirmationToken.value,
        requestedAt: new Date(Date.now()).toJSON(),
    }).then(val => {
        router.push('/');
        toast.success('Аккаунт подтвержден');
        return val;
    });
});
</script>
<template>
    <div></div>
</template>