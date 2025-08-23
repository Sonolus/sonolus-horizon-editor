<script setup lang="ts" generic="const T">
import BaseOptionalField from './BaseOptionalField.vue'
import { createOptional } from './optionalField'

const props = defineProps<{
    label: string
    options: [string, NoInfer<T>][]
    autofocus?: boolean
}>()

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
const modelValue = defineModel<T | undefined>({ required: true })

const { isEnabled, enabledValue } = createOptional(
    modelValue,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    props.options[0]![1],
)
</script>

<template>
    <BaseOptionalField v-model="isEnabled" :label :autofocus>
        <select
            v-model.lazy="enabledValue"
            class="w-full appearance-none bg-[#222] px-2 py-1 transition-colors hover:bg-[#444] active:bg-[#111]"
            required
        >
            <option v-for="([name, value], index) in options" :key="index" :value>
                {{ name }}
            </option>
        </select>
    </BaseOptionalField>
</template>
