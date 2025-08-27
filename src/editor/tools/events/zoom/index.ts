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
import ZoomEventSidebar from './ZoomEventSidebar.vue'

export type DefaultZoomEventProperties = {
    ease?: Ease
}

export let defaultZoomEventProperties: DefaultZoomEventProperties = {}

export const setDefaultZoomEventProperties = (properties: DefaultZoomEventProperties) => {
    defaultZoomEventProperties = properties
}

const toValue = (x: number) => clamp(align(laneToZoomEventValue(xToLane(x)), 10))

export const [zoomEvent, editSelectedZoomEvents] = createEventTool(
    () => i18n.value.tools.events.types.zoomEvent,
    ZoomEventSidebar,
    (object) => showModal(ZoomEventPropertiesModal, { object }),

    (value, x) => value === toValue(x),
    (beat, x) => toValue(x),
    (beat, sx, x) => toValue(x),
    () => defaultZoomEventProperties.ease,

    'zoomEventJoint',
    toZoomEventJointEntity,
    addZoomEventJoint,
    removeZoomEventJoint,
)
