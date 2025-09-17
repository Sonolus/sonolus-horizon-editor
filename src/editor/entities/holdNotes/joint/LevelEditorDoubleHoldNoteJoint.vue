<script setup lang="ts">
import { computed } from 'vue'
import { colors } from '../../../../colors'
import { bpms } from '../../../../history/bpms'
import type { DoubleHoldNoteJointEntity } from '../../../../state/entities/holdNotes/joints/double'
import { beatToTime } from '../../../../state/integrals/bpms'
import { ups } from '../../../view'

const props = defineProps<DoubleHoldNoteJointEntity>()

const points = computed(() => {
    const x1 = 3 - Math.max(props.laneL, props.laneR)
    const x2 = 4 - Math.min(props.laneL, props.laneR)

    const y2 = beatToTime(bpms.value, props.beat) * ups.value
    const y1 = y2 - 0.25

    return `${x1} ${y2} ${x1 + 0.5} ${y1} ${x2 - 0.5} ${y1} ${x2} ${y2}`
})
</script>

<template>
    <polygon
        :points
        class="scale-stroke"
        stroke-width="0.05"
        stroke="#fff"
        :fill="colors[color]"
        fill-opacity="0.5"
    />
</template>
