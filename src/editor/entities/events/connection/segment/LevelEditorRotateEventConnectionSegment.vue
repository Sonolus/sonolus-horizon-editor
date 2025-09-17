<script setup lang="ts">
import { computed } from 'vue'
import type { Segment } from '.'
import type { RotateEventConnectionEntity } from '../../../../../state/entities/events/connections/rotate'
import { rotateEventValueToLane } from '../../../../../state/entities/events/joints/rotate'
import { lerp, remap } from '../../../../../utils/math'
import { easeCurve, easeValue } from '../../../../ease'
import { ups } from '../../../../view'

const props = defineProps<{
    entity: RotateEventConnectionEntity
    segment: Segment
}>()

const sToValue = (s: number) => lerp(props.entity.min.value, props.entity.max.value, s)

const paths = computed(() => {
    const { min, max } = props.segment
    const ease = props.entity.min.ease

    const value1 = sToValue(easeValue(min.s, ease))
    const value2 = sToValue(easeValue(max.s, ease))

    const w = -(value1 - value2)
    const x1 = 3.5 - rotateEventValueToLane(value1)
    const x2 = x1 + w

    const y1 = min.time * ups.value
    const y2 = max.time * ups.value

    const d =
        ease === 'linear' || value1 === value2
            ? `M ${x1} ${y1} L ${x2} ${y2}`
            : `M ${x1} ${y1} Q ${remap(value1, value2, x1, x2, sToValue(easeCurve(min.s, max.s, ease)))} ${(y1 + y2) / 2} ${x2} ${y2}`

    const paths: {
        transform: string
        d: string
    }[] = []

    const step = Math.sign(w) * -8
    let x = x2
    while (true) {
        paths.push({
            transform: `translate(${x - x2}, 0)`,
            d,
        })

        if (x >= -4 && x <= 4) break
        x += step
    }

    return paths
})
</script>

<template>
    <path v-for="(path, index) in paths" :key="index" v-bind="path" />
</template>
