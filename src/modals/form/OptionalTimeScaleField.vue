<script setup lang="ts">
import { i18n } from '../../i18n'
import OptionalNumberField from './OptionalNumberField.vue'

defineProps<{
    validate?: boolean
    autofocus?: boolean
}>()

const modelValue = defineModel<number | undefined>({ required: true })
</script>

<template>
    <OptionalNumberField
        v-model="modelValue"
        :label="i18n.modals.form.timeScale.label"
        :min="0.001"
        :max="1000"
        :step="0.001"
        :validate
        :autofocus
    />
</template>
