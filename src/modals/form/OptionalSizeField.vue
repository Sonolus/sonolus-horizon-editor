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
        :label="i18n.modals.form.size.label"
        :min="0"
        :max="7"
        :step="1"
        :validate
        :autofocus
    />
</template>
