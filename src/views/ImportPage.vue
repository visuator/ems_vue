<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { ref, computed, watch } from 'vue'
import { IMPORT_TYPES } from '../constants/import'
import axios from '../modules/axios'
import toast from '../modules/toast'
import router from '../router/router'

const selectedFile = ref();
const selectedImportType = ref(IMPORT_TYPES.at(0).id);
const percentage = ref(0);
const selectedImport = computed(() => IMPORT_TYPES.find(x => x.id === selectedImportType.value));
const hideProgressBar = computed(() => percentage.value === 100 || percentage.value === 0);

watch(router.currentRoute, (val) => {
    if (val.query.variant) {
        selectedImportType.value = Number(val.query.variant);
    }
}, {
    immediate: true
});

const handleImport = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    console.log(selectedImport.value);
    await axios.post(selectedImport.value.url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
            percentage.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        },
    }).then(val => {
        toast.success('Импортировано');
        return val;
    })
};
</script>
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-4">
                <div class="card">
                    <div class="card-header">Импорт</div>
                    <div class="card-body">
                        <Form @submit="handleImport" v-slot="{ errors }">
                            <label class="form-label" for="importType">Тип импорта</label>
                            <Field v-model="selectedImportType" id="importType" name="importType" as="select"
                                class="form-control mb-2">
                                <option v-for="importType in IMPORT_TYPES" :key="importType.id" :value="importType.id">{{
                                    importType.name }}
                                </option>
                            </Field>
                            <label class="form-label" for="file">Выбрать файл</label>
                            <Field v-model="selectedFile" id="file" name="file" class="form-control"
                                :class="[errors.file ? '' : 'mb-3', errors.file ? 'is-invalid' : '']" type="file"></Field>
                            <ErrorMessage v-slot="{ message }" name="file">
                                <div class="invalid-feedback">
                                    {{ message }}
                                </div>
                            </ErrorMessage>
                            <button class="btn btn-primary d-block w-100 mb-2"
                                :class="{ 'disabled': Object.keys(errors).length }" type="submit">Импортировать</button>
                            <div v-if="!hideProgressBar" class="progress">
                                <div class="progress-bar" role="progressbar" style="height: 20px"
                                    :style="{ 'width': `${percentage}%` }" aria-valuenow="0" aria-valuemin="0"
                                    aria-valuemax="100">
                                    {{ percentage }}%
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
</div></template>