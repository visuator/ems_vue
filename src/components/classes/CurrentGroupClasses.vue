<script setup>
import { defineProps, defineEmits } from 'vue';
import { CLASS_STATUSES } from '../../constants/classes';
import { beautifyDateTime, getPersonFullName } from '../../modules/helpers';

const props = defineProps({
    classes: Array,
    modelValue: String,
});
const emit = defineEmits(['update:model-value']);

const handleSelect = (c) => {
    emit('update:model-value', c.id);
};

const isActive = (c) => {
    return props.modelValue ? props.modelValue === c.id : false;
}
</script>
<template>
    <ol class="list-group list-group-numbered overflow-auto" style="max-height: 300px!important">
        <li class="d-flex list-group-item list-group-item-action" :class="{ 'active': isActive(c) }" v-for="c in props.classes" :key="c.id"
            @click="handleSelect(c)">
            <div>
                <div class="ms-2 fw-bold mb-2">{{ c.lesson.name }}</div>
                <div>
                    <span class="d-block mb-1 badge" :class="`bg-${CLASS_STATUSES[c.status].color}`">{{
                        CLASS_STATUSES[c.status].name }}</span>
                    <span class="d-block mb-1">Преподаватель: {{
                        getPersonFullName(c.lecturer)
                    }}</span>
                    <span class="d-block mb-1">Аудитория: {{ c.classroom.name }}</span>
                    <span class="d-block mb-1">Начало: {{ beautifyDateTime(c.startingAt)
                    }}</span>
                    <span class="d-block">Конец: {{ beautifyDateTime(c.endingAt) }}</span>
                </div>
            </div>
        </li>
    </ol>
</template>