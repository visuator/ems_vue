<script setup>
import { onMounted, defineProps } from 'vue'

const props = defineProps({
   callback: Function,
   text: String,
});

onMounted(() => {
    window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: props.callback,
        itp_support: false,
        auto_select: false,
    });
    window.google.accounts.id.renderButton(document.getElementById('g_sign_in_btn'), {
        text: props.text
    });
});
</script>
<template>
    <div>
        <div id="g_sign_in_btn"></div>
    </div>
</template>