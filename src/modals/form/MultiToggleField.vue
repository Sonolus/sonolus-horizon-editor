<script setup lang="ts">
import { i18n } from '../../i18n'
import BaseField from './BaseField.vue'

defineProps<{
    label: string
    disabled?: string
    enabled?: string
}>()

const modelValue = defineModel<boolean | undefined>({ required: true })
</script>

<template>
    <BaseField :label>
        <input
            class="w-full bg-[#222] px-2 py-1 text-left transition-colors hover:bg-[#444] active:bg-[#111]"
            type="button"
            :value="
                modelValue === undefined
                    ? ''
                    : modelValue
                      ? (enabled ?? i18n.modals.form.toggle.enabled)
                      : (disabled ?? i18n.modals.form.toggle.disabled)
            "
            @click="modelValue = !modelValue"
        />
    </BaseField>
</template>
