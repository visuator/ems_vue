<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { string } from 'yup';
import { QueryBuilder } from 'odata-query-builder';
import { beautifyDate } from '../modules/helpers';
import DescribedItem from '../components/DescribedItem.vue';
import axios from '../modules/axios';
import toast from '../modules/toast';

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
                            <div style="max-height: 150px!important; overflow: auto;">
                                <DescribedItem v-for="s in settings" :key="s.id" :propertyAccessors="[{ name: 'Создан', value: beautifyDate(s.createdAt) }, {
                                    name: 'Квартал', value: quarters.find(x => x.value ===
                                        s.currentQuarter).name
                                }]"></DescribedItem>
                            </div>
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