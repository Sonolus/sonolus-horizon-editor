<script setup lang="ts">
import { colors } from '../../../../colors'
import { bpms } from '../../../../history/bpms'
import type { DoubleHoldNoteConnectionEntity } from '../../../../state/entities/holdNotes/connections/double'
import { beatToTime } from '../../../../state/integrals/bpms'
import { computedRange } from '../../../../utils/range'
import { viewBox } from '../../../view'

const props = defineProps<DoubleHoldNoteConnectionEntity>()

const y = computedRange(() => ({
    min: beatToTime(bpms.value, props.min.beat) * viewBox.value.ups,
    max: beatToTime(bpms.value, props.max.beat) * viewBox.value.ups,
}))
</script>

<template>
    <rect
        :x="3 - Math.max(min.laneL, min.laneR)"
        :y="y.max"
        :width="Math.abs(min.laneL - min.laneR) + 1"
        :height="y.min - y.max"
        :fill="colors[min.color]"
        fill-opacity="0.5"
    />
</template>
