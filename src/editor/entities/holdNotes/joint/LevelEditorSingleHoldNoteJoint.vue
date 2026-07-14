<script setup lang="ts">
import { computed } from 'vue'
import { colors } from '../../../../colors'
import { bpms } from '../../../../history/bpms'
import type { SingleHoldNoteJointEntity } from '../../../../state/entities/holdNotes/joints/single'
import { beatToTime } from '../../../../state/integrals/bpms'
import { lerp } from '../../../../utils/math'
import { ups } from '../../../view'

const props = defineProps<SingleHoldNoteJointEntity>()

const time = computed(() => beatToTime(bpms.value, props.beat))

const points = computed(() => {
    const x1 = 3 - props.lane
    const x2 = 4 - props.lane
    const xm = (x1 + x2) / 2

    const y2 = time.value * ups.value
    const y1 = y2 - 0.3

    return `${x1} ${y2} ${lerp(xm, x1, props.scaleL)} ${lerp(y1, y2, props.scaleL)} ${lerp(xm, x2, props.scaleR)} ${lerp(y1, y2, props.scaleR)} ${x2} ${y2}`
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
