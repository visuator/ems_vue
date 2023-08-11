<script setup>
import router from '../router/router'
import toast from '../modules/toast'
import axios from '../modules/axios'
import { onMounted, computed } from 'vue'

const passwordResetToken = computed(() => router.currentRoute.value.query.passwordResetToken);
onMounted(async () => {
    await axios.post('auth/confirmPasswordReset', {
        passwordResetToken: passwordResetToken.value,
        requestedAt: new Date(Date.now()).toJSON(),
    }).then(val => {
        router.push('/');
        toast.info('Данные нового пароля высланы на почту');
        return val;
    });
});
</script>
<template>
    <div></div>
</template>