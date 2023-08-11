<script setup>
import { ref, onMounted, watch } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { beautifyDateTime } from '../modules/helpers';
import { QueryBuilder } from 'odata-query-builder';
import { string } from 'yup';
import { IMPORT_TYPES } from '../constants/import';
import axios from '../modules/axios'

const group = ref();
const groupInfo = ref();
const groups = ref();
const groupFieldSchema = string().required();

const statuses = {
    0: { color: 'success', name: 'Текущий' },
    1: { color: 'info', name: 'Следующий' },
    2: { color: 'secondary', name: 'Предыдущий' },
};

onMounted(async () => {
    const query = new QueryBuilder();
    query.orderBy('createdAt desc');
    await axios.get(`groups/${query.toQuery()}`).then(val => {
        groups.value = val.data;
        group.value = groups.value?.at(0).id;
        return val;
    });
});

watch(group, async (newVal) => {
    await axios.get(`groups/${newVal}`, {
        params: {
            requestedAt: new Date(Date.now())
        }
    }).then(val => {
        groupInfo.value = val.data;
        return val;
    });
});
</script>
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-4">
                <div class="card">
                    <div class="card-header">Группы</div>
                    <div class="card-body">
                        <template v-if="groups?.length">
                            <Form v-slot="{ errors }">
                                <label class="form-label" for="group">Выберите группу</label>
                                <Field v-model="group" :rules="groupFieldSchema" id="group" class="form-control"
                                    :class="errors.group ? 'is-invalid' : 'mb-2'" name="group" as="select">
                                    <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
                                </Field>
                                <ErrorMessage v-slot="{ message }" name="group">
                                    <div class="invalid-feedback">{{ message }}</div>
                                </ErrorMessage>
                            </Form>
                            <hr/>
                        </template>
                        <template v-else>
                            <div class="alert alert-warning">В системе отсутствуют группы</div>
                            <router-link
                                :to="`/import/?variant=${IMPORT_TYPES.find(x => x.systemName === 'groups').id}`"></router-link>
                        </template>
                        <template v-if="groupInfo?.classes?.length">
                            <ol class="list-group list-group-numbered overflow-auto"
                                    style="max-height: 300px!important">
                                    <li class="list-group-item d-flex" v-for="c in groupInfo?.classes" :key="c.id">
                                        <div>
                                            <div class="ms-2 fw-bold mb-2">{{ c.lesson.name }}</div>
                                            <div>
                                                <span class="d-block mb-1 badge" :class="`bg-${statuses[c.status].color}`">{{ statuses[c.status].name }}</span>
                                                <span class="d-block mb-1">Начало: {{ beautifyDateTime(c.startingAt) }}</span>
                                                <span class="d-block">Конец: {{ beautifyDateTime(c.endingAt) }}</span>
                                            </div>
                                        </div>
                                    </li>
                                </ol>
                        </template>
                        <template v-else>
                            <div class="alert alert-info">Нет занятий</div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>