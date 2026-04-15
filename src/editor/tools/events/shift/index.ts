import { ref } from 'vue'
import { createEventTool, type DefaultEventProperties } from '..'
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

export const defaultShiftEventProperties = ref<DefaultEventProperties>({
    copyProperties: true,
})

const toValue = (x: number) => clamp(align(laneToShiftEventValue(xToLane(x)), 10))

export const [shiftEvent, editShiftEventJoint, editSelectedShiftEventJoint] = createEventTool(
    () => i18n.value.tools.events.titles.shiftEvent,
    () => i18n.value.tools.events.types.shiftEvent,
    ShiftEventSidebar,
    () => showModal(ShiftEventPropertiesModal, {}),
    defaultShiftEventProperties,

    (value, x) => value === toValue(x),
    (beat, x) => toValue(x),
    (beat, sx, x) => toValue(x),

    'shiftEventJoint',
    toShiftEventJointEntity,
    addShiftEventJoint,
    removeShiftEventJoint,
)
