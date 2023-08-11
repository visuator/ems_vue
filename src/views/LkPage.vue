<script setup>
import { onMounted, ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore';
import { EXTERNAL_PROVIDERS } from '../constants/externalProviders';
import { GOOGLE_CONTINUE_WITH } from '../constants/google';
import { beautifyDate } from '../modules/helpers';
import { QueryBuilder } from 'odata-query-builder';
import axios from '../modules/axios';
import toast from '../modules/toast';
import GoogleSignIn from '../components/GoogleSignIn.vue';

const userStore = useUserStore();
const user = computed(() => userStore.user);
const externalAccounts = ref();

const validationErrors = [
    { message: 'ACCOUNT_NOT_EXISTS', toast: 'Аккаунт не существует' },
    { message: 'ACCOUNT_NOT_CONFIRMED', toast: 'Аккаунт не подтвержден' },
    { message: 'EXTERNAL_ACCOUNT_ALREADY_EXISTS', toast: 'Такой привязанный аккаунт уже существует' },
]

// get External Accounts TODO
const loadExternalAccounts = async () => {
    const query = new QueryBuilder();
    query.orderBy('createdAt desc');
    query.filter(x => {
        x.filterPhrase(`accountId eq ${user.value.id}`);
        return x;
    }, 'and');
    await axios.get('accounts/external').then(val => {
        externalAccounts.value = val.data;
        return val;
    });
};
onMounted(async () => {
    await loadExternalAccounts();
});
const googleCallback = async (e) => {
    await axios.post('oauth/google/link', {
        credential: e.credential,
    }).then(async (val) => {
        await loadExternalAccounts();
        return val;
    }, error => {
        if (error.response.status === 400) {
            const errorModel = validationErrors.find(x => x.message === error.response.data.errors["AddExternalAccountModel"][0]);
            if (errorModel) {
                toast.error(errorModel.toast);
            }
        }
    });
};
const externalAccount = ref();
const handleDeleteExternalAccount = async () => {
    await axios.delete(`auth/external/${externalAccount.value}`).then(async (val) => {
        toast.success('Аккаунт отвязан');
        await loadExternalAccounts();
        return val;
    });
}
</script>
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-4">
                <div class="card">
                    <div class="card-header">Личный кабинет</div>
                    <div class="card-body">
                        <template v-if="externalAccounts?.length">
                            <p>Привязанные аккаунты:</p>
                            <ol class="list-group list-group-numbered overflow-auto" style="max-height: 300px!important">
                                <li class="list-group-item list-group-item-action d-flex" @click="async () => { externalAccount = ea.id; await handleDeleteExternalAccount(); }"
                                    v-for="ea in externalAccounts" :key="ea.id">
                                    <div>
                                        <div class="ms-2 fw-bold mb-2">
                                            {{ ea.externalEmail }}
                                            <i class="ms-2 bi"
                                                :class="EXTERNAL_PROVIDERS[ea.externalAccountProvider].icon"></i>
                                        </div>
                                        <div>
                                            <span class="d-block">Создан: {{ beautifyDate(ea.createdAt) }}</span>
                                        </div>
                                    </div>
                                </li>
                            </ol>
                        </template>
                        <template v-else>
                            <div class="alert alert-info">У вас нет привязанных аккаунтов</div>
                        </template>
                        <hr />
                        <p>Привязать аккаунт Google</p>
                        <GoogleSignIn :text="GOOGLE_CONTINUE_WITH" :callback="googleCallback"></GoogleSignIn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>