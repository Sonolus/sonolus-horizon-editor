<script setup lang="ts">
import { i18n } from '../../i18n'
import MultiNumberField from './MultiNumberField.vue'

const modelValue = defineModel<number | undefined>({ required: true })
</script>

<template>
    <MultiNumberField
        v-model="modelValue"
        :label="i18n.modals.form.laneR.label"
        :min="0"
        :max="7"
        :step="1"
    />
</template>
