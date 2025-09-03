<script setup lang="ts">
import { colorNames } from '../../colors'
import { i18n } from '../../i18n'
import MultiSelectField from './MultiSelectField.vue'

const modelValue = defineModel<number | undefined>({ required: true })
</script>

<template>
    <MultiSelectField
        v-model="modelValue"
        :label="i18n.modals.form.color.label"
        :options="colorNames.map((name, index) => [i18n.modals.form.color[name], index])"
    />
</template>
