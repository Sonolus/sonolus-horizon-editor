import { createEventTool } from '..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import {
    laneToZoomEventValue,
    toZoomEventJointEntity,
} from '../../../../state/entities/events/joints/zoom'
import { addZoomEventJoint, removeZoomEventJoint } from '../../../../state/mutations/events/zoom'
import { align, clamp } from '../../../../utils/math'
import type { Ease } from '../../../ease'
import { xToLane } from '../../../view'
import ZoomEventPropertiesModal from './ZoomEventPropertiesModal.vue'

export type ZoomEventProperties = {
    ease?: Ease
}

export let zoomEventProperties: ZoomEventProperties = {}

export const setZoomEventProperties = (properties: ZoomEventProperties) => {
    zoomEventProperties = properties
}

const toValue = (x: number) => clamp(align(laneToZoomEventValue(xToLane(x)), 10))

export const zoomEvent = createEventTool(
    () => i18n.value.tools.events.types.zoomEvent,
    (object) => showModal(ZoomEventPropertiesModal, { object }),

    (value, x) => value === toValue(x),
    (beat, x) => toValue(x),
    (beat, sx, x) => toValue(x),
    () => zoomEventProperties.ease,

    'zoomEventJoint',
    toZoomEventJointEntity,
    addZoomEventJoint,
    removeZoomEventJoint,
)
