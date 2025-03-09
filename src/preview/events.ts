import { computed } from 'vue'
import { beats, scaledTimes } from '.'
import { easeValue } from '../editor/ease'
import { bpms } from '../history/bpms'
import { store } from '../history/store'
import { timeScales } from '../history/timeScales'
import type { EventConnectionEntityType } from '../state/entities/events/connections'
import type { EventJointEntityType } from '../state/entities/events/joints'
import { beatToTime } from '../state/integrals/bpms'
import { timeToScaledTime } from '../state/integrals/timeScales'
import { getInStoreGrid } from '../state/store/grid'
import { lerp, unlerp } from '../utils/math'

const getEvent = (jointType: EventJointEntityType, connectionType: EventConnectionEntityType) => {
    const current = computed(() => {
        const connection = getInStoreGrid(store.value.grid, connectionType, beats.value.min)?.find(
            (entity) => beats.value.min >= entity.min.beat && beats.value.min <= entity.max.beat,
        )
        if (!connection) return

        return {
            min: {
                scaledTime: timeToScaledTime(
                    timeScales.value,
                    beatToTime(bpms.value, connection.min.beat),
                ),
                value: connection.min.value,
            },
            max: {
                scaledTime: timeToScaledTime(
                    timeScales.value,
                    beatToTime(bpms.value, connection.max.beat),
                ),
                value: connection.max.value,
            },
            ease: connection.min.ease,
        }
    })

    return computed(() => {
        if (!current.value) {
            const range = store.value.eventRanges[jointType]
            if (!range) return 0

            return beats.value.min < range.min.beat ? range.min.value : range.max.value
        }

        const { min, max, ease } = current.value

        const s = unlerp(min.scaledTime, max.scaledTime, scaledTimes.value.min)
        return lerp(min.value, max.value, easeValue(s, ease))
    })
}

export const rotate = getEvent('rotateEventJoint', 'rotateEventConnection')

export const shift = getEvent('shiftEventJoint', 'shiftEventConnection')

export const zoom = getEvent('zoomEventJoint', 'zoomEventConnection')
