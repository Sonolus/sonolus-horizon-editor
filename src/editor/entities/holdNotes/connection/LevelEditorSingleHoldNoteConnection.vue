<script setup lang="ts">
import { colors } from '../../../../colors'
import { bpms } from '../../../../history/bpms'
import type { SingleHoldNoteConnectionEntity } from '../../../../state/entities/holdNotes/connections/single'
import { beatToTime } from '../../../../state/integrals/bpms'
import { computedRange } from '../../../../utils/range'
import { viewBox } from '../../../view'

const props = defineProps<SingleHoldNoteConnectionEntity>()

const y = computedRange(() => ({
    min: beatToTime(bpms.value, props.min.beat) * viewBox.value.ups,
    max: beatToTime(bpms.value, props.max.beat) * viewBox.value.ups,
}))
</script>

<template>
    <rect
        :x="3 - min.lane"
        :y="y.max"
        width="1"
        :height="y.min - y.max"
        :fill="colors[min.color]"
        fill-opacity="0.5"
    />
</template>
