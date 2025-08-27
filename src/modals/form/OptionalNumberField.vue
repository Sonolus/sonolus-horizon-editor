<script setup lang="ts">
import BaseField from './BaseField.vue'

defineProps<{
    label: string
    min?: number
    max?: number
    step?: number | 'any'
    autofocus?: boolean
}>()

const modelValue = defineModel<number | undefined>({
    required: true,
    set: (value) => (typeof value === 'number' ? value : undefined),
})

const onFocus = (event: FocusEvent) => {
    ;(event.currentTarget as HTMLInputElement | null)?.select()
}
</script>

<template>
    <BaseField :label>
        <input
            v-model.lazy="modelValue"
            class="w-full appearance-none bg-[#222] px-2 py-1 transition-colors hover:bg-[#444] active:bg-[#111]"
            type="number"
            :min
            :max
            :step
            :autofocus
            @focus="onFocus"
        />
    </BaseField>
</template>
