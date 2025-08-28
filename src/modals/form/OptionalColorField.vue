<script setup lang="ts">
import { colorNames } from '../../colors'
import { i18n } from '../../i18n'
import OptionalSelectField from './OptionalSelectField.vue'

const modelValue = defineModel<number | undefined>({ required: true })
</script>

<template>
    <OptionalSelectField
        v-model="modelValue"
        :label="i18n.modals.form.color.label"
        :options="colorNames.map((name, index) => [i18n.modals.form.color[name], index])"
    />
</template>
