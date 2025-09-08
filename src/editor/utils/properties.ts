import { computed } from 'vue'

export const useProperties =
    <T>(get: () => T, set: (properties: T) => void) =>
    <K extends keyof T>(key: K) =>
        computed({
            get: () => get()[key],
            set: (value) => {
                set({ ...get(), [key]: value })
            },
        })
