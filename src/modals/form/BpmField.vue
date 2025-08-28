<script setup lang="ts">
import { i18n } from '../../i18n'
import NumberField from './NumberField.vue'

const modelValue = defineModel<number>({ required: true })
</script>

<template>
    <NumberField v-model="modelValue" :label="i18n.modals.form.bpm.label" :min="1" step="any" />
</template>
