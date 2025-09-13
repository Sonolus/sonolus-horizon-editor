import type { Command } from '../..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { notify } from '../../../notification'
import { focusSidebar, isSidebarVisible } from '../../../sidebars'
import { switchToolTo, toolName } from '../../../tools'
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

    execute() {
        if (toolName.value === 'zoomEvent') {
            if (isSidebarVisible.value) {
                focusSidebar()
            } else {
                void showModal(DefaultZoomEventPropertiesModal, {})
            }
        } else {
            switchToolTo('zoomEvent')

            notify(() => i18n.value.commands.zoomEvent.switched)
        }
    },
}
