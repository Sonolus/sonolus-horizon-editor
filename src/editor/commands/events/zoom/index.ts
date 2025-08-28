import type { Command } from '../..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { notify } from '../../../notification'
import { isSidebarVisible } from '../../../sidebars'
import { switchToolTo, toolName } from '../../../tools'
import {
    defaultZoomEventProperties,
    setDefaultZoomEventProperties,
} from '../../../tools/events/zoom'
import EventIcon from '../EventIcon.vue'
import DefaultZoomEventPropertiesModal from './DefaultZoomEventPropertiesModal.vue'

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
            if (isSidebarVisible.value) return

            const properties = await showModal(DefaultZoomEventPropertiesModal, {
                properties: defaultZoomEventProperties,
            })
            if (!properties) return

            setDefaultZoomEventProperties(properties)
        } else {
            switchToolTo('zoomEvent')

            notify(() => i18n.value.commands.zoomEvent.switched)
        }
    },
}
