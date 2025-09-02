<script setup lang="ts" generic="const T">
import BaseField from './BaseField.vue'

defineProps<{
    label: string
    options: [string, NoInfer<T>][]
}>()

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
const modelValue = defineModel<T | undefined>({ required: true })
</script>

<template>
    <BaseField :label>
        <select
            v-model.lazy="modelValue"
            class="w-full appearance-none bg-[#222] px-2 py-1 transition-colors hover:bg-[#444] active:bg-[#111]"
        >
            <option :value="undefined" disabled />
            <option v-for="([name, value], index) in options" :key="index" :value>
                {{ name }}
            </option>
        </select>
    </BaseField>
</template>
