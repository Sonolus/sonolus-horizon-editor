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

const modelValue = defineModel<number>({
    required: true,
    set: (value) => (input.value?.reportValidity() ? value : modelValue.value),
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
            required
            @focus="onFocus"
        />
    </BaseField>
</template>
