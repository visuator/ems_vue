import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/router'

import "vue-toastification/dist/index.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import '@vuepic/vue-datepicker/dist/main.css'
import "bootstrap-icons/font/bootstrap-icons.css"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
