import type { Command } from '../..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { notify } from '../../../notification'
import { switchToolTo, toolName } from '../../../tools'
import { setZoomEventProperties, zoomEventProperties } from '../../../tools/events/zoom'
import EventIcon from '../EventIcon.vue'
import ZoomEventPropertiesModal from './ZoomEventPropertiesModal.vue'

export const zoomEvent: Command = {
    title: () => i18n.value.commands.zoomEvent.title,
    icon: {
        is: EventIcon,
        props: {
            fill: '#00f',
        },
    },

    async execute() {
        if (toolName.value === 'zoomEvent') {
            const properties = await showModal(ZoomEventPropertiesModal, {
                zoomEventProperties,
            })
            if (!properties) return

            setZoomEventProperties(properties)
        } else {
            switchToolTo('zoomEvent')

            notify(() => i18n.value.commands.zoomEvent.switched)
        }
    },
}
