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
</script>
<template>
    <template v-for="c in props.classes" :key="c.id">
        <dl @click="handleSelect(c)">
            <dt>Предмет</dt>
            <dd>{{ c.lesson.name }}</dd>
            <dt>Статус</dt>
            <dd>
                <span class="d-block mb-1 badge" :class="`bg-${CLASS_STATUSES[c.status].color}`">{{
                    CLASS_STATUSES[c.status].name }}</span>
            </dd>
            <dt>Преподаватель</dt>
            <dd>{{
                getPersonFullName(c.lecturer)
            }}</dd>
            <dt>Аудитория</dt>
            <dd>{{ c.classroom.name }}</dd>
            <dt>Начало</dt>
            <dd>{{ beautifyDateTime(c.startingAt)
            }}</dd>
            <dt>Конец</dt>
            <dd>{{ beautifyDateTime(c.endingAt) }}</dd>
        </dl>
        <hr />
    </template>
</template>