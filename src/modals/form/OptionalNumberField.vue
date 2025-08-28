<script setup lang="ts">
import { useTemplateRef, type Ref } from 'vue'
import BaseField from './BaseField.vue'

defineProps<{
    label: string
    min?: number
    max?: number
    step?: number | 'any'
}>()

const input: Ref<HTMLInputElement | null> = useTemplateRef('input')

const modelValue = defineModel<number | undefined>({
    required: true,
    set: (value) =>
        input.value?.reportValidity()
            ? typeof value === 'number'
                ? value
                : undefined
            : modelValue.value,
})

const onFocus = (event: FocusEvent) => {
    ;(event.currentTarget as HTMLInputElement | null)?.select()
}
</script>

<template>
    <BaseField :label>
        <input
            ref="input"
            v-model.lazy="modelValue"
            class="w-full appearance-none bg-[#222] px-2 py-1 transition-colors hover:bg-[#444] active:bg-[#111]"
            type="number"
            :min
            :max
            :step
            @focus="onFocus"
        />
    </BaseField>
</template>
