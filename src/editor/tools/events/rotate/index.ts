import { createEventTool } from '..'
import { store } from '../../../../history/store'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { toRotateEventJointEntity } from '../../../../state/entities/events/joints/rotate'
import {
    addRotateEventJoint,
    removeRotateEventJoint,
} from '../../../../state/mutations/events/rotate'
import { getInStoreGrid } from '../../../../state/store/grid'
import { align, clamp } from '../../../../utils/math'
import type { Ease } from '../../../ease'
import { xToLane } from '../../../view'
import RotateEventPropertiesModal from './RotateEventPropertiesModal.vue'
import RotateEventSidebar from './RotateEventSidebar.vue'

export type DefaultRotateEventProperties = {
    ease?: Ease
}

export let defaultRotateEventProperties: DefaultRotateEventProperties = {}

export const setDefaultRotateEventProperties = (properties: DefaultRotateEventProperties) => {
    defaultRotateEventProperties = properties
}

const toValue = (x: number) => -clamp(align(xToLane(x), 2), -0.5, 7.5)

const getPrev = (beat: number) => {
    const connection = getInStoreGrid(store.value.grid, 'rotateEventConnection', beat)?.find(
        (entity) => beat >= entity.min.beat && beat < entity.max.beat,
    )
    if (connection) return connection.min

    const range = store.value.eventRanges.rotateEventJoint
    return range && beat >= range.max.beat ? range.max : undefined
}

export const [rotateEvent, editSelectedRotateEvents] = createEventTool(
    () => i18n.value.tools.events.types.rotateEvent,
    RotateEventSidebar,
    (object) => showModal(RotateEventPropertiesModal, { object }),

    (value, x) => (value - toValue(x)) % 8 === 0,
    (beat, x) => {
        const value = toValue(x)

        const prev = getPrev(beat)
        if (!prev) return value

        return value - Math.floor((0.5 - prev.value) / 8) * 8
    },
    (value, sx, x) => value - align(xToLane(x), 2) + align(xToLane(sx), 2),
    () => defaultRotateEventProperties.ease,

    'rotateEventJoint',
    toRotateEventJointEntity,
    addRotateEventJoint,
    removeRotateEventJoint,
)
