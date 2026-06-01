import { computed } from 'vue'
import { beats, scaledTimes, times } from '.'
import { easeValue } from '../editor/ease'
import { bpms } from '../history/bpms'
import { store } from '../history/store'
import { timeScales } from '../history/timeScales'
import type { EventConnectionEntityType } from '../state/entities/events/connections'
import type { EventJointEntity, EventJointEntityType } from '../state/entities/events/joints'
import { beatToTime } from '../state/integrals/bpms'
import { timeToScaledTime } from '../state/integrals/timeScales'
import { getInStoreGrid } from '../state/store/grid'
import { lerp, unlerp } from '../utils/math'

const getEvent = (jointType: EventJointEntityType, connectionType: EventConnectionEntityType) => {
    const connection = computed(() =>
        getInStoreGrid(store.value.grid, connectionType, beats.value.min)?.find(
            (entity) => beats.value.min >= entity.min.beat && beats.value.min <= entity.max.beat,
        ),
    )

    const get = (entity: EventJointEntity) => {
        const time = beatToTime(bpms.value, entity.beat)

        return {
            time,
            scaledTime: timeToScaledTime(timeScales.value, time),
            value: entity.value,
        }
    }

    const current = computed(() => {
        if (!connection.value) return

        const { min, max } = connection.value

        return {
            min: get(min),
            max: get(max),
            ease: min.ease,
            ignoreTimeScale: min.ignoreTimeScale,
        }
    })

    return computed(() => {
        if (!current.value) {
            const range = store.value.eventRanges[jointType]
            if (!range) return 0

            return beats.value.min < range.min.beat ? range.min.value : range.max.value
        }

        const { min, max, ease, ignoreTimeScale } = current.value

        const s = ignoreTimeScale
            ? unlerp(min.time, max.time, times.value.min)
            : unlerp(min.scaledTime, max.scaledTime, scaledTimes.value.min)
        return lerp(min.value, max.value, easeValue(s, ease))
    })
}

export const rotate = getEvent('rotateEventJoint', 'rotateEventConnection')

export const shift = getEvent('shiftEventJoint', 'shiftEventConnection')

export const zoom = getEvent('zoomEventJoint', 'zoomEventConnection')
