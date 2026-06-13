import { createEventTool } from '..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import {
    laneToZoomEventValue,
    toZoomEventJointEntity,
} from '../../../../state/entities/events/joints/zoom'
import { addZoomEventJoint, removeZoomEventJoint } from '../../../../state/mutations/events/zoom'
import { align, clamp } from '../../../../utils/math'
import { xToLane } from '../../../view'
import { getSettingsRef } from '../../utils.ts'
import ZoomEventPropertiesModal from './ZoomEventPropertiesModal.vue'
import ZoomEventSidebar from './ZoomEventSidebar.vue'

export const defaultZoomEventProperties = getSettingsRef('defaultZoomEventProperties')

const toValue = (x: number) => clamp(align(laneToZoomEventValue(xToLane(x)), 10))

export const [zoomEvent, editZoomEventJoint, editSelectedZoomEventJoint] = createEventTool(
    () => i18n.value.tools.events.titles.zoomEvent,
    () => i18n.value.tools.events.types.zoomEvent,
    ZoomEventSidebar,
    () => showModal(ZoomEventPropertiesModal, {}),
    defaultZoomEventProperties,

    (value, x) => value === toValue(x),
    (beat, x) => toValue(x),
    (beat, sx, x) => toValue(x),

    'zoomEventJoint',
    toZoomEventJointEntity,
    addZoomEventJoint,
    removeZoomEventJoint,
)
