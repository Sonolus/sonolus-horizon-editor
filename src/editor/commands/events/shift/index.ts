import type { Command } from '../..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { notify } from '../../../notification'
import { focusSidebar, isSidebarVisible } from '../../../sidebars'
import { switchToolTo, toolName } from '../../../tools'
import {
    defaultShiftEventProperties,
    setDefaultShiftEventProperties,
} from '../../../tools/events/shift'
import EventIcon from '../EventIcon.vue'
import DefaultShiftEventPropertiesModal from './DefaultShiftEventPropertiesModal.vue'

export const shiftEvent: Command = {
    title: () => i18n.value.commands.shiftEvent.title,
    icon: {
        is: EventIcon,
        props: {
            fill: '#f00',
        },
    },

    async execute() {
        if (toolName.value === 'shiftEvent') {
            if (isSidebarVisible.value) {
                focusSidebar()
                return
            }

            const properties = await showModal(DefaultShiftEventPropertiesModal, {
                properties: defaultShiftEventProperties,
            })
            if (!properties) return

            setDefaultShiftEventProperties(properties)
        } else {
            switchToolTo('shiftEvent')

            notify(() => i18n.value.commands.shiftEvent.switched)
        }
    },
}
