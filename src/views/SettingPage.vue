<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { string } from 'yup';
import { QueryBuilder } from 'odata-query-builder';
import axios from '../modules/axios';
import toast from '../modules/toast';
import { beautifyDate } from '../modules/helpers';

const quarters = [
    { id: 1, name: '1-я неделя', value: 0 },
    { id: 2, name: '2-я неделя', value: 1 },
];
const quarter = ref(0);
const quarterFieldSchema = string().required();
const settings = ref();

onMounted(async () => {
    await loadSettings();
})
const loadSettings = async () => {
    const query = new QueryBuilder();
    query.orderBy('createdAt desc');
    await axios.get(`settings/${query.toQuery()}`).then(val => {
        settings.value = val.data;
        return val;
    });
}
const handleCreateSetting = async () => {
    await axios.post('settings', {
        currentQuarter: quarter.value
    }).then(async (val) => {
        toast.success('Настройка создана');
        await loadSettings();
        return val;
    });
}
</script>
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-3">
                <div class="card">
                    <div class="card-header">Добавить настройку</div>
                    <div class="card-body">
                        <Form @submit="handleCreateSetting" v-slot="{ errors }">
                            <label for="quarter">Выбрать текущий квартал</label>
                            <Field v-model="quarter" :rules="quarterFieldSchema" id="quarter" name="quarter"
                                class="form-control"
                                :class="[errors.quarter ? '' : 'mb-3', errors.quarter ? 'is-invalid' : '']" as="select">
                                <option v-for="q in quarters" :key="q.id" :value="q.value">{{ q.name }}</option>
                            </Field>
                            <ErrorMessage name="quarter" v-slot="{ message }">
                                <div class="invalid-feedback">{{ message }}</div>
                            </ErrorMessage>
                            <button class="btn btn-primary d-block w-100">Создать</button>
                        </Form>
                        <hr />
                        <template v-if="settings?.length">
                            <p>Настройки:</p>
                            <ol class="list-group list-group-numbered overflow-auto" style="max-height: 300px!important">
                                <li class="list-group-item list-group-item-action d-flex" v-for="s in settings" :key="s.id">
                                    <div>
                                        <div class="ms-2 fw-bold mb-2">
                                            {{ beautifyDate(s.createdAt) }}
                                        </div>
                                        <div>
                                            <span class="d-block">Квартал: {{ quarters.find(x => x.value ===
                                                s.currentQuarter).name }}</span>
                                        </div>
                                    </div>
                                </li>
                            </ol>
                        </template>
                        <template v-else>
                            <div class="alert alert-info">Настроек нет</div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>