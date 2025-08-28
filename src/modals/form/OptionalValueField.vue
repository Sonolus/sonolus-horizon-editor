<script setup lang="ts">
import { i18n } from '../../i18n'
import OptionalNumberField from './OptionalNumberField.vue'

defineProps<{
    autofocus?: boolean
}>()

const modelValue = defineModel<number | undefined>({ required: true })
</script>

<template>
    <OptionalNumberField
        v-model="modelValue"
        :label="i18n.modals.form.value.label"
        :min="0"
        :max="1"
        step="any"
        :autofocus
    />
</template>
