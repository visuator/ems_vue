<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { beautifyDate } from '../modules/helpers'
import { string } from 'yup';
import { ref, onMounted } from 'vue';
import { QueryBuilder } from 'odata-query-builder';
import { IMPORT_TYPES } from '../constants/import';
import toast from '../modules/toast';
import axios from '../modules/axios';

const settings = ref();
const classVersions = ref();
const classVersion = ref();
const classVersionFieldSchema = string().required();

const loadClassVersions = async () => {
    const query = new QueryBuilder();
    query.orderBy('createdAt desc');
    query.filter(x => {
        x.filterPhrase(`status eq 'Draft'`);
        return x;
    }, 'and');
    await axios.get(`classVersions/${query.toQuery()}`).then(val => {
        classVersions.value = val.data;
        classVersion.value = val.data.at(0)?.id;
        return val;
    });
};
const loadSettings = async () => {
    const query = new QueryBuilder();
    query.orderBy('createdAt desc');
    await axios.get(`settings/${query.toQuery()}`).then(val => {
        settings.value = val.data;
        return val;
    });
}
onMounted(async () => {
    await loadSettings();
    await loadClassVersions();
});

const handlePublish = async () => {
    await axios.post('classVersions/publish', {
        classVersionId: classVersion.value,
        requestedAt: new Date(Date.now()),
    }).then(async (val) => {
        toast.success('Расписание опубликовано');
        await loadSettings();
        await loadClassVersions();
        return val;
    });
}
</script>
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-4">
                <div class="card">
                    <div class="card-header">Расписание</div>
                    <div class="card-body">
                        <template v-if="settings?.length">
                            <template v-if="classVersions?.length">
                                <Form v-slot="{ errors }" @submit="handlePublish">
                                <label class="form-label" for="classVersion">Выбор расписания</label>
                                <Field v-model="classVersion" :rules="classVersionFieldSchema"
                                    :class="[errors.classVersion ? '' : 'mb-3', errors.classVersion ? 'is-invalid' : '']"
                                    id="classVersion" name="classVersion" as="select" class="form-control">
                                    <option v-for="classVersion in classVersions" :key="classVersion.id"
                                        :value="classVersion.id">{{ classVersion.name }} &mdash; {{
                                            beautifyDate(classVersion.createdAt) }}</option>
                                </Field>
                                <ErrorMessage v-slot="{ message }" name="classVersion">
                                    <div class="invalid-feedback">
                                        {{ message }}
                                    </div>
                                </ErrorMessage>
                                <button class="btn btn-primary d-block w-100 mb-2" type="submit"
                                    :class="{ 'disabled': Object.keys(errors).length }">Отправить</button>
                            </Form>
                            </template>
                            <template v-else>
                                <div class="alert alert-warning">В системе отсутствуют черновики расписания</div>
                                <router-link class="btn btn-primary d-block" :to="`/import/?variant=${IMPORT_TYPES.find(x => x.systemName === 'classVersion').id}`">Импортировать</router-link>
                            </template>
                        </template>
                        <template v-else>
                            <div class="alert alert-warning">В системе отсутствуют настройки</div>
                            <router-link class="btn btn-primary d-block" to="/setting">Создать</router-link>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>