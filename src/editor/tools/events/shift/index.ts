import { createEventTool } from '..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import {
    laneToShiftEventValue,
    toShiftEventJointEntity,
} from '../../../../state/entities/events/joints/shift'
import { addShiftEventJoint, removeShiftEventJoint } from '../../../../state/mutations/events/shift'
import { align, clamp } from '../../../../utils/math'
import type { Ease } from '../../../ease'
import { xToLane } from '../../../view'
import ShiftEventPropertiesModal from './ShiftEventPropertiesModal.vue'

export type DefaultShiftEventProperties = {
    ease?: Ease
}

export let defaultShiftEventProperties: DefaultShiftEventProperties = {}

export const setDefaultShiftEventProperties = (properties: DefaultShiftEventProperties) => {
    defaultShiftEventProperties = properties
}

const toValue = (x: number) => clamp(align(laneToShiftEventValue(xToLane(x)), 10))

export const shiftEvent = createEventTool(
    () => i18n.value.tools.events.types.shiftEvent,
    (object) => showModal(ShiftEventPropertiesModal, { object }),

    (value, x) => value === toValue(x),
    (beat, x) => toValue(x),
    (beat, sx, x) => toValue(x),
    () => defaultShiftEventProperties.ease,

    'shiftEventJoint',
    toShiftEventJointEntity,
    addShiftEventJoint,
    removeShiftEventJoint,
)
