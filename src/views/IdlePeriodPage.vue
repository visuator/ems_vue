<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { ref, onMounted } from 'vue'
import { string } from 'yup'
import { QueryBuilder } from 'odata-query-builder'
import axios from '../modules/axios';
import VueDatePicker from '@vuepic/vue-datepicker';
import toast from '../modules/toast';
import { beautifyDate } from '../modules/helpers';
import { IMPORT_TYPES } from '../constants/import';

const isCommon = ref(false);

const group = ref('');
const groups = ref([]);
const groupFieldSchema = string().required();

const startingAt = ref('');
const startingAtFieldSchema = string().required();
const endingAt = ref('');
const endingAtFieldSchema = string().required();

const idlePeriods = ref([]);

const loadGroups = async () => {
    const query = new QueryBuilder();
    query.orderBy('name');
    await axios.get(`groups/${query.toQuery()}`).then(val => {
        groups.value = val.data;
        group.value = val.data.at(0)?.id;
        return val;
    });
};
const loadIdlePeriods = async () => {
    const query = new QueryBuilder();
    query.orderBy('createdAt desc');
    await axios.get(`idlePeriods/${query.toQuery()}`).then(val => {
        idlePeriods.value = val.data;
        return val;
    });
}
onMounted(async () => {
    await loadGroups();
    await loadIdlePeriods();
});

const handleCreatePeriod = async () => {
    await axios.post('idlePeriods', {
        groupId: isCommon.value ? null : group.value,
        startingAt: new Date(startingAt.value).toJSON(),
        endingAt: new Date(endingAt.value).toJSON(),
    }).then(async (val) => {
        toast.success('Период простоя успешно добавлен');
        await loadGroups();
        await loadIdlePeriods();
        return val;
    })
};
</script>
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-4">
                <div class="card">
                    <div class="card-header">Периоды простоя</div>
                    <div class="card-body">
                        <template v-if="groups?.length">
                            <Form v-slot="{ errors }" @submit="handleCreatePeriod">
                                <div class="form-check mb-2">
                                    <input v-model="isCommon" class="form-check-input" type="checkbox" value=""
                                        id="commonCheckbox">
                                    <label class="form-check-label" for="commonCheckbox">
                                        Общий
                                    </label>
                                </div>
                                <label class="form-label" for="group">Выбор группы</label>
                                <Field v-model="group" :rules="groupFieldSchema"
                                    :class="[errors.group ? '' : 'mb-3', errors.group ? 'is-invalid' : '']" id="group"
                                    name="group" as="select" class="form-control" .disabled="isCommon">
                                    <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
                                </Field>
                                <ErrorMessage v-slot="{ message }" name="group">
                                    <div class="invalid-feedback d-block">
                                        {{ message }}
                                    </div>
                                </ErrorMessage>
                                <label class="form-label" for="startingAt">Дата начала</label>
                                <Field v-model="startingAt" v-slot="{ componentField }" :rules="startingAtFieldSchema"
                                    name="startingAt" id="startingAt">
                                    <VueDatePicker v-bind="componentField" :class="errors.startingAt ? '' : 'mb-3'"
                                        clearable placeholder="Дата начала" />
                                </Field>
                                <ErrorMessage v-slot="{ message }" name="startingAt">
                                    <div class="invalid-feedback d-block">
                                        {{ message }}
                                    </div>
                                </ErrorMessage>
                                <label class="form-label" for="endingAt">Дата окончания</label>
                                <Field v-model="endingAt" v-slot="{ componentField }" :rules="endingAtFieldSchema"
                                    name="endingAt" id="endingAt">
                                    <VueDatePicker v-bind="componentField" :class="errors.endingAt ? '' : 'mb-3'" clearable
                                        placeholder="Дата окончания" />
                                </Field>
                                <ErrorMessage v-slot="{ message }" name="endingAt">
                                    <div class="invalid-feedback d-block">
                                        {{ message }}
                                    </div>
                                </ErrorMessage>
                                <button class="btn btn-primary d-block w-100 mt-2" type="submit"
                                    :class="{ 'disabled': Object.keys(errors).length }">Создать</button>
                            </Form>
                            <hr />
                            <template v-if="idlePeriods?.length">
                                <ol class="list-group list-group-numbered overflow-auto"
                                    style="max-height: 300px!important">
                                    <li class="list-group-item d-flex" v-for="ip in idlePeriods" :key="ip.id">
                                        <div>
                                            <div class="ms-2 fw-bold mb-2">{{ beautifyDate(ip.createdAt) }}</div>
                                            <div>
                                                <span class="d-block mb-1">Начало: {{ beautifyDate(ip.startingAt) }}</span>
                                                <span class="d-block">Конец: {{ beautifyDate(ip.endingAt) }}</span>
                                            </div>
                                        </div>
                                    </li>
                                </ol>
                            </template>
                            <template v-else>
                                <div class="alert alert-info">Периоды простоя отсутствуют</div>
                            </template>
                        </template>
                        <template v-else>
                            <div class="alert alert-warning">В системе отсутствуют группы</div>
                            <router-link class="btn btn-primary" :to="`import/?variant=${IMPORT_TYPES.find(x => x.systemName === 'groups').id}`">Импортировать</router-link>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>