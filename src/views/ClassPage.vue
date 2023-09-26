<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { ref, onMounted, watch } from 'vue'
import { string } from 'yup'
import { QueryBuilder } from 'odata-query-builder';
import CurrentGroupClasses from '../components/classes/CurrentGroupClasses.vue';
import toast from '../modules/toast';
import axios from '../modules/axios';
import { getPersonFullName } from '../modules/helpers';

const group = ref();
const groups = ref();
const groupFieldSchema = string().required();

const sourceClass = ref();
const sourceClasses = ref();
const sourceClassFieldSchema = string().required();

const lecturer = ref();
const lecturers = ref();
const lecturerFieldSchema = string().required();

const classroom = ref();
const classrooms = ref();
const classroomFieldSchema = string().required();

const lesson = ref();
const lessons = ref();
const lessonFieldSchema = string().required();

onMounted(async () => {
    const query = new QueryBuilder();
    query.orderBy('name');
    await axios.get(`groups/${query.toQuery()}`).then(val => {
        groups.value = val.data;
        group.value = groups.value?.at(0)?.id;
        return val;
    });
});
onMounted(async () => {
    const query = new QueryBuilder();
    query.orderBy('name');
    await axios.get(`classrooms/${query.toQuery()}`).then(val => {
        classrooms.value = val.data;
        classroom.value = classrooms.value?.at(0)?.id;
        return val;
    });
});
onMounted(async () => {
    const query = new QueryBuilder();
    query.orderBy('createdAt desc');
    await axios.get(`lecturers/${query.toQuery()}`).then(val => {
        lecturers.value = val.data;
        lecturer.value = lecturers.value?.at(0)?.id;
        return val;
    });
});
onMounted(async () => {
    const query = new QueryBuilder();
    query.orderBy('name');
    await axios.get(`lessons/${query.toQuery()}`).then(val => {
        lessons.value = val.data;
        lesson.value = lessons.value?.at(0)?.id;
        return val;
    });
});
watch(group, async (newVal) => {
    await axios.get(`classes/group/${newVal}`, {
        params: {
            requestedAt: new Date(Date.now()).toJSON()
        }
    }).then(val => {
        sourceClasses.value = val.data;
        return val;
    });
});

const handleCreateReplacement = async () => {
    await axios.post(`classes/${sourceClass.value}/replace`, {
        lecturerId: lecturer.value,
        lessonId: lesson.value,
        classroomId: classroom.value
    }).then(val => {
        toast.success('Замена выставлена');
        return val;
    });
}
</script>
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-4">
                <div class="card">
                    <div class="card-header">Занятия</div>
                    <div class="card-body">
                        <Form @submit="handleCreateReplacement" v-slot="{ errors }">
                            <label class="form-label" for="group">Выберите группу</label>
                            <Field v-model="group" :rules="groupFieldSchema" id="group" class="form-control"
                                :class="errors.group ? 'is-invalid' : 'mb-2'" name="group" as="select">
                                <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
                            </Field>
                            <ErrorMessage v-slot="{ message }" name="group">
                                <div class="invalid-feedback">{{ message }}</div>
                            </ErrorMessage>
                            <template v-if="sourceClasses?.length">
                                <label for="sourceClass" class="form-label">Выберите занятие</label>
                                <Field v-model="sourceClass" :rules="sourceClassFieldSchema" id="sourceClass"
                                    name="sourceClass" v-slot="{ componentField }">
                                    <CurrentGroupClasses class="mb-3" :classes="sourceClasses" v-bind="componentField">
                                    </CurrentGroupClasses>
                                </Field>
                                <ErrorMessage name="sourceClass" v-slot="{ message }">
                                    <div class="invalid-feedback d-block">
                                        {{ message }}
                                    </div>
                                </ErrorMessage>
                                <template v-if="sourceClass">
                                    <label for="lecturer" class="form-label">Выберите преподавателя</label>
                                    <Field v-model="lecturer" class="form-control" :rules="lecturerFieldSchema" :class="errors.lecturer ? 'is-invalid' : 'mb-2'" name="lecturer" id="lecturer" as="select">
                                        <option v-for="l in lecturers" :key="l.id" :value="l.id">{{ getPersonFullName(l) }}</option>
                                    </Field>
                                    <ErrorMessage v-slot="{ message }" name="lecturer">
                                        <div class="invalid-feedback">
                                            {{ message }}
                                        </div>
                                    </ErrorMessage>
                                    <label for="classroom" class="form-label">Выберите аудиторию</label>
                                    <Field v-model="classroom" class="form-control" :rules="classroomFieldSchema" :class="errors.classroom ? 'is-invalid' : 'mb-2'" name="classroom" id="classroom" as="select">
                                        <option v-for="c in classrooms" :key="c.id" :value="c.id">{{ c.name }}</option>
                                    </Field>
                                    <ErrorMessage v-slot="{ message }" name="classroom">
                                        <div class="invalid-feedback">
                                            {{ message }}
                                        </div>
                                    </ErrorMessage>
                                    <label for="lesson" class="form-label">Выберите предмет</label>
                                    <Field v-model="lesson" class="form-control" :rules="lessonFieldSchema" :class="errors.lesson ? 'is-invalid' : 'mb-2'" name="lesson" id="lesson" as="select">
                                        <option v-for="l in lessons" :key="l.id" :value="l.id">{{ l.name }}</option>
                                    </Field>
                                    <ErrorMessage v-slot="{ message }" name="lesson">
                                        <div class="invalid-feedback">
                                            {{ message }}
                                        </div>
                                    </ErrorMessage>
                                </template>
                                <button :class="{ 'disabled': Object.keys(errors).length }" class="btn btn-primary d-block w-100" type="submit">Заменить</button>
                            </template>
                            <template v-else>
                                <div class="alert alert-info">Занятий нет</div>
                            </template>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>