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
        :label="i18n.modals.form.laneR.label"
        :min="0"
        :max="7"
        :step="1"
        :autofocus
    />
</template>
