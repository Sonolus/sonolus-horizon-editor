import { computed } from 'vue'
import { view } from '../editor/view'
import { bpms } from '../history/bpms'
import { timeScales } from '../history/timeScales'
import { timeToBeat } from '../state/integrals/bpms'
import { scaledTimeToTime, timeToScaledTime } from '../state/integrals/timeScales'
import { beatToKey } from '../state/store/grid'
import { computedRange } from '../utils/range'
import { noteDuration } from './note'

export const scaledTimes = computed(() => {
    const min = timeToScaledTime(timeScales.value, view.cursorTime)

    return {
        min,
        max: min + noteDuration.value,
    }
})

export const times = computed(() => ({
    min: view.cursorTime,
    max: scaledTimeToTime(timeScales.value, scaledTimes.value.max),
}))

export const beats = computed(() => ({
    min: timeToBeat(bpms.value, times.value.min),
    max: timeToBeat(bpms.value, times.value.max),
}))

export const keys = computedRange(() => ({
    min: beatToKey(beats.value.min),
    max: beatToKey(beats.value.max),
}))
