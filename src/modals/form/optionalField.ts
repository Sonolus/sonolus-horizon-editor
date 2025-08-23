import { computed, type Ref } from 'vue'

export const createOptional = <T>(modelValue: Ref<T | undefined>, defaultValue: T) => ({
    isEnabled: computed({
        get: () => modelValue.value !== undefined,
        set: (value) => (modelValue.value = value ? defaultValue : undefined),
    }),
    enabledValue: computed({
        get: () => modelValue.value ?? defaultValue,
        set: (value) => (modelValue.value = value),
    }),
})
