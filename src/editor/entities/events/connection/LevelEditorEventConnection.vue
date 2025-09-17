<script setup lang="ts">
import { computed } from 'vue'
import { bpms } from '../../../../history/bpms'
import { timeScales } from '../../../../history/timeScales'
import type { EventConnectionEntity } from '../../../../state/entities/events/connections'
import { beatToTime } from '../../../../state/integrals/bpms'
import { timeToScaledTime } from '../../../../state/integrals/timeScales'
import { unlerp } from '../../../../utils/math'
import { bisect } from '../../../../utils/ordered'
import { computedRange } from '../../../../utils/range'
import type { Segment, SegmentJoint } from './segment'

const props = defineProps<EventConnectionEntity>()

const times = computedRange(() => ({
    min: beatToTime(bpms.value, props.min.beat),
    max: beatToTime(bpms.value, props.max.beat),
}))

const scaledTimes = computedRange(() => ({
    min: timeToScaledTime(timeScales.value, times.value.min),
    max: timeToScaledTime(timeScales.value, times.value.max),
}))

const segments = computed(() => {
    const scaledTimeToS = (scaledTime: number) =>
        unlerp(scaledTimes.value.min, scaledTimes.value.max, scaledTime)

    const segments: Segment[] = []

    let max: SegmentJoint | undefined

    for (let i = bisect(timeScales.value, 'x', times.value.max) - 1; i >= 0; i--) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { x, y, s } = timeScales.value[i]!

        max ??= {
            time: times.value.max,
            s: scaledTimeToS(y + (times.value.max - x) * s),
        }

        const min: SegmentJoint =
            times.value.min > x
                ? {
                      time: times.value.min,
                      s: scaledTimeToS(y + (times.value.min - x) * s),
                  }
                : {
                      time: x,
                      s: scaledTimeToS(y),
                  }

        segments.push({
            min,
            max,
        })

        if (times.value.min >= x) break

        max = min
    }

    return segments.filter(({ min, max }) => !Number.isNaN(min.s) && !Number.isNaN(max.s))
})
</script>

<template>
    <slot v-for="segment in segments" :segment />
</template>
