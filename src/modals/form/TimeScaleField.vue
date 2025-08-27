<script setup lang="ts">
import { i18n } from '../../i18n'
import NumberField from './NumberField.vue'

defineProps<{
    autofocus?: boolean
}>()

const modelValue = defineModel<number>({ required: true })
</script>

<template>
    <NumberField
        v-model="modelValue"
        :label="i18n.modals.form.timeScale.label"
        :min="0.001"
        :max="1000"
        :step="0.001"
        :autofocus
    />
</template>
