<script setup>
defineProps({
    propertyAccessors: Array
});
</script>
<template>
    <dl>
        <template v-for="pa in propertyAccessors" :key="pa.id">
            <dt>{{ pa.name }}</dt>
            <dd>{{ pa.value }}</dd>
            <slot></slot>
        </template>
    </dl>
    <hr/>
</template>