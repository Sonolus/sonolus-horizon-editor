<script setup lang="ts">
import { colorNames } from '../../colors'
import { i18n } from '../../i18n'
import OptionalSelectField from './OptionalSelectField.vue'

defineProps<{
    label: string
    autofocus?: boolean
}>()

const modelValue = defineModel<number | undefined>({ required: true })
</script>

<template>
    <OptionalSelectField
        v-model="modelValue"
        :label
        :default-value="0"
        :options="colorNames.map((name, index) => [i18n.modals.form.color[name], index])"
        :autofocus
    />
</template>
