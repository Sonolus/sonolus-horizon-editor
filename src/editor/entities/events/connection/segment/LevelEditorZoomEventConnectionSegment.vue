<script setup lang="ts">
import { computed } from 'vue'
import type { Segment } from '.'
import type { ZoomEventConnectionEntity } from '../../../../../state/entities/events/connections/zoom'
import { zoomEventValueToLane } from '../../../../../state/entities/events/joints/zoom'
import { lerp } from '../../../../../utils/math'
import { easeCurve, easeValue } from '../../../../ease'
import { ups } from '../../../../view'

const props = defineProps<{
    entity: ZoomEventConnectionEntity
    segment: Segment
}>()

const sToX = (s: number) =>
    3.5 - zoomEventValueToLane(lerp(props.entity.min.value, props.entity.max.value, s))

const d = computed(() => {
    const { min, max } = props.segment
    const ease = props.entity.min.ease

    const x1 = sToX(easeValue(min.s, ease))
    const x2 = sToX(easeValue(max.s, ease))

    const y1 = min.time * ups.value
    const y2 = max.time * ups.value

    return ease === 'linear'
        ? `M ${x1} ${y1} L ${x2} ${y2}`
        : `M ${x1} ${y1} Q ${sToX(easeCurve(min.s, max.s, ease))} ${(y1 + y2) / 2} ${x2} ${y2}`
})
</script>

<template>
    <path :d />
</template>
