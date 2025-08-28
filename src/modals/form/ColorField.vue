<script setup lang="ts">
import { colorNames } from '../../colors'
import { i18n } from '../../i18n'
import SelectField from './SelectField.vue'

const modelValue = defineModel<number>({ required: true })
</script>

<template>
    <SelectField
        v-model="modelValue"
        :label="i18n.modals.form.color.label"
        :options="colorNames.map((name, index) => [i18n.modals.form.color[name], index])"
    />
</template>
