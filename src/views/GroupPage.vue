<script setup>
import { ref, onMounted, watch } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { QueryBuilder } from 'odata-query-builder';
import { string } from 'yup';
import { IMPORT_TYPES } from '../constants/import';
import axios from '../modules/axios'
import CurrentGroupClasses from '../components/classes/CurrentGroupClasses.vue';

const group = ref();
const classes = ref();
const groups = ref();
const groupFieldSchema = string().required();

onMounted(async () => {
    const query = new QueryBuilder();
    query.orderBy('name');
    await axios.get(`groups/${query.toQuery()}`).then(val => {
        groups.value = val.data;
        group.value = groups.value?.at(0)?.id;
        return val;
    });
});

watch(group, async (newVal) => {
    await axios.get(`classes/group/${newVal}`, {
        params: {
            requestedAt: new Date(Date.now())
        }
    }).then(val => {
        classes.value = val.data;
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
                            <hr />
                        </template>
                        <template v-else>
                            <div class="alert alert-warning">В системе отсутствуют группы</div>
                            <router-link
                                :to="`/import/?variant=${IMPORT_TYPES.find(x => x.systemName === 'groups').id}`"></router-link>
                        </template>
                        <template v-if="classes?.length">
                            <CurrentGroupClasses :classes="classes" />
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