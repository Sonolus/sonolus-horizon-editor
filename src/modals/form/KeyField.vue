<script setup lang="ts">
import { ref } from 'vue'
import { i18n } from '../../i18n'
import BaseField from './BaseField.vue'

defineProps<{
    label: string
}>()

const modelValue = defineModel<string | undefined>({ required: true })

const isActive = ref(false)

const onClick = () => {
    isActive.value = true

    modelValue.value = undefined
}

const onKeyDown = (event: KeyboardEvent) => {
    if (!isActive.value) return

    modelValue.value = event.key
}

const onBlur = () => {
    isActive.value = false
}
</script>

<template>
    <BaseField :label>
        <button
            class="w-full bg-[#222] px-2 py-1 text-left transition-colors hover:bg-[#444] active:bg-[#111]"
            :class="{ 'animate-pulse': isActive }"
            :title="i18n.modals.form.key.input"
            @click="onClick"
            @keydown.prevent="onKeyDown"
            @blur="onBlur"
        >
            {{
                modelValue === ' '
                    ? 'Space'
                    : (modelValue ?? (isActive ? i18n.modals.form.key.press : '\xa0'))
            }}
        </button>
    </BaseField>
</template>
