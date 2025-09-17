<script setup lang="ts">
import { colors } from '../../../../colors'
import { bpms } from '../../../../history/bpms'
import type { SingleHoldNoteConnectionEntity } from '../../../../state/entities/holdNotes/connections/single'
import { beatToTime } from '../../../../state/integrals/bpms'
import { computedRange } from '../../../../utils/range'
import { ups } from '../../../view'

const props = defineProps<SingleHoldNoteConnectionEntity>()

const time = computedRange(() => ({
    min: beatToTime(bpms.value, props.min.beat),
    max: beatToTime(bpms.value, props.max.beat),
}))

const y = computedRange(() => ({
    min: time.value.min * ups.value,
    max: time.value.max * ups.value,
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
