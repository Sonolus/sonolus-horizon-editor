<script setup lang="ts">
import type { Ease } from '../../chart'
import { i18n } from '../../i18n'
import OptionalSelectField from './OptionalSelectField.vue'

const modelValue = defineModel<Ease | undefined>({ required: true })
</script>

<template>
    <OptionalSelectField
        v-model="modelValue"
        :label="i18n.modals.form.ease.label"
        :options="[
            [i18n.modals.form.ease.out, 'out'],
            [i18n.modals.form.ease.linear, 'linear'],
            [i18n.modals.form.ease.in, 'in'],
        ]"
    />
</template>
