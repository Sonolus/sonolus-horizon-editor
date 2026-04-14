import { ref } from 'vue'
import { createEventTool } from '..'
import type { Ease } from '../../../../chart'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import {
    laneToShiftEventValue,
    toShiftEventJointEntity,
} from '../../../../state/entities/events/joints/shift'
import { addShiftEventJoint, removeShiftEventJoint } from '../../../../state/mutations/events/shift'
import { align, clamp } from '../../../../utils/math'
import { xToLane } from '../../../view'
import ShiftEventPropertiesModal from './ShiftEventPropertiesModal.vue'
import ShiftEventSidebar from './ShiftEventSidebar.vue'

export type DefaultShiftEventProperties = {
    ease?: Ease
    ignoreTimeScale?: boolean
}

export const defaultShiftEventProperties = ref<DefaultShiftEventProperties>({})

const toValue = (x: number) => clamp(align(laneToShiftEventValue(xToLane(x)), 10))

export const [shiftEvent, editShiftEventJoint, editSelectedShiftEventJoint] = createEventTool(
    () => i18n.value.tools.events.types.shiftEvent,
    ShiftEventSidebar,
    () => showModal(ShiftEventPropertiesModal, {}),

    (value, x) => value === toValue(x),
    (beat, x) => toValue(x),
    (beat, sx, x) => toValue(x),
    () => defaultShiftEventProperties.value.ease,
    () => defaultShiftEventProperties.value.ignoreTimeScale,

    'shiftEventJoint',
    toShiftEventJointEntity,
    addShiftEventJoint,
    removeShiftEventJoint,
)
