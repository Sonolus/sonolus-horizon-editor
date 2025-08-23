<script setup lang="ts">
import BaseOptionalField from './BaseOptionalField.vue'
import { createOptional } from './optionalField'

const props = defineProps<{
    label: string
    defaultValue: number
    min?: number
    max?: number
    step?: number | 'any'
    autofocus?: boolean
}>()

const modelValue = defineModel<number | undefined>({ required: true })

const { isEnabled, enabledValue } = createOptional(modelValue, props.defaultValue)

const onFocus = (event: FocusEvent) => {
    ;(event.currentTarget as HTMLInputElement | null)?.select()
}
</script>

<template>
    <BaseOptionalField v-model="isEnabled" :label :autofocus>
        <input
            v-model.lazy="enabledValue"
            class="w-full appearance-none bg-[#222] px-2 py-1 transition-colors hover:bg-[#444] active:bg-[#111]"
            type="number"
            :min
            :max
            :step
            required
            @focus="onFocus"
        />
    </BaseOptionalField>
</template>
