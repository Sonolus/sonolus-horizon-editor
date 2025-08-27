import { computed, ref, watch } from 'vue'
import { time } from './time'

const width = ref(0)

export const screenSm = computed(() => width.value >= 640)

watch(time, () => {
    width.value = document.documentElement.clientWidth
})
