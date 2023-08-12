<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { ref } from 'vue'
import { string } from 'yup'
import { useUserStore } from '../stores/userStore'
import axios from '../modules/axios'
import toast from '../modules/toast'
import router from '../router/router'
import GoogleSignIn from '../components/GoogleSignIn.vue'
import { GOOGLE_SIGNIN_WITH } from '../constants/google'

const login = ref('');
const password = ref('');
const confirmRequired = ref(false);
const emailFieldSchema = string().required().email();
const passwordFieldSchema = string().required();

const validationErrors = [
    { message: 'ACCOUNT_NOT_EXISTS', toast: 'Аккаунт не привязан' },
    { message: 'ACCOUNT_NOT_CONFIRMED', toast: 'Аккаунт не подтвержден', action: () => { confirmRequired.value = true; } },
    { message: 'ACCOUNT_INVALID_PASSWORD', toast: 'Неправильный пароль' },
    { message: 'ACCOUNT_LOCKED', toast: 'Аккаунт заблокирован' },
];

const resetPassword = async () => {
    await axios.post('auth/resetPassword', {
        email: login.value,
        requestedAt: new Date(Date.now()).toJSON(),
    }).then(val => {
        toast.info('Проверьте почту');
        return val;
    });
};
const handleLogin = async () => {
    if (confirmRequired.value) {
        await axios.post('auth/reconfirm', {
            email: login.value,
            requestedAt: new Date(Date.now()).toJSON(),
        }).then(val => {
            toast.info('Проверьте электронную почту');
            return val;
        });

        confirmRequired.value = false;
        return;
    }
    await axios.post('auth/login', {
        email: login.value,
        password: password.value,
        requestedAt: new Date(Date.now()).toJSON(),
    }).then(val => {
        const userStore = useUserStore();
        userStore.set(val.data.accessToken, val.data.refreshToken, val.data.expiresAt, val.data.roles);
        toast.success('Успешная авторизация');
        router.push('/');
    }, error => {
        if (error.response.status === 400) {
            const errorModel = validationErrors.find(x => x.message === error.response.data.errors["LoginModel"][0]);
            if (errorModel) {
                toast.error(errorModel.toast);
                errorModel.action?.();
            }
        }
    });
};

const googleCallback = async (e) => {
    await axios.post('oauth/google', {
        credential: e.credential,
    }).then(val => {
        const userStore = useUserStore();
        userStore.set(val.data.accessToken, val.data.refreshToken, val.data.expiresAt, val.data.roles);
        toast.success('Успешная авторизация');
        router.push('/');
    }, error => {
        if (error.response.status === 400) {
            const errorModel = validationErrors.find(x => x.message === error.response.data.errors["OAuthLoginModel"][0]);
            if (errorModel) {
                toast.error(errorModel.toast);
                errorModel.action?.();
            }
        }
    });
};

</script>
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-3">
                <div style="margin-top: 170px; height: 300px;">
                    <Form @submit="handleLogin" v-slot="{ errors }">
                        <div class="mb-3">
                            <label for="email" class="form-label">Электронная почта</label>
                            <Field v-model="login" :rules="emailFieldSchema" name="email" type="email" id="email"
                                class="form-control" :class="[{}, errors.email ? 'is-invalid' : '']"
                                placeholder="example@mail.com"></Field>
                            <ErrorMessage name="email" v-slot="{ message }">
                                <div class="invalid-feedback">
                                    {{ message }}
                                </div>
                            </ErrorMessage>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Пароль</label>
                            <Field v-model="password" :rules="passwordFieldSchema" name="password" type="password"
                                id="passowrd" class="form-control" :class="[{}, errors.password ? 'is-invalid' : '']">
                            </Field>
                            <ErrorMessage name="email" v-slot="{ message }">
                                <div class="invalid-feedback">
                                    {{ message }}
                                </div>
                            </ErrorMessage>
                        </div>
                        <hr class="m-0" />
                        <div class="mb-2">
                            <button class="btn btn-link link-secondary p-0"
                                :class="{ 'disabled': Object.keys(errors).length }" type="button"
                                @click="resetPassword">Забыли пароль?</button>
                        </div>
                        <div class="mb-1">
                            <button class="btn btn-primary d-block w-100"
                                :class="{ 'disabled': Object.keys(errors).length }" type="submit">{{ confirmRequired ?
                                    'Подтвердить аккаунт' : 'Войти' }}</button>
                        </div>
                    </Form>
                    <hr />
                    <GoogleSignIn :text="GOOGLE_SIGNIN_WITH" :callback="googleCallback"></GoogleSignIn>
                </div>
            </div>
        </div>
    </div>
</template>