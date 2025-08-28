import type { Command } from '../..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { notify } from '../../../notification'
import { isSidebarVisible } from '../../../sidebars'
import { switchToolTo, toolName } from '../../../tools'
import {
    defaultRotateEventProperties,
    setDefaultRotateEventProperties,
} from '../../../tools/events/rotate'
import EventIcon from '../EventIcon.vue'
import DefaultRotateEventPropertiesModal from './DefaultRotateEventPropertiesModal.vue'

export const rotateEvent: Command = {
    title: () => i18n.value.commands.rotateEvent.title,
    icon: {
        is: EventIcon,
        props: {
            fill: '#0f0',
        },
    },

    async execute() {
        if (toolName.value === 'rotateEvent') {
            if (isSidebarVisible.value) return

            const properties = await showModal(DefaultRotateEventPropertiesModal, {
                properties: defaultRotateEventProperties,
            })
            if (!properties) return

            setDefaultRotateEventProperties(properties)
        } else {
            switchToolTo('rotateEvent')

            notify(() => i18n.value.commands.rotateEvent.switched)
        }
    },
}
