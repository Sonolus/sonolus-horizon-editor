import type { Command } from '../..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { notify } from '../../../notification'
import { switchToolTo, toolName } from '../../../tools'
import { rotateEventProperties, setRotateEventProperties } from '../../../tools/events/rotate'
import EventIcon from '../EventIcon.vue'
import RotateEventPropertiesModal from './RotateEventPropertiesModal.vue'

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
            const properties = await showModal(RotateEventPropertiesModal, {
                rotateEventProperties,
            })
            if (!properties) return

            setRotateEventProperties(properties)
        } else {
            switchToolTo('rotateEvent')

            notify(() => i18n.value.commands.rotateEvent.switched)
        }
    },
}
