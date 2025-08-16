import type { Command } from '../..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { notify } from '../../../notification'
import { switchToolTo, toolName } from '../../../tools'
import { setShiftEventProperties, shiftEventProperties } from '../../../tools/events/shift'
import EventIcon from '../EventIcon.vue'
import ShiftEventPropertiesModal from './ShiftEventPropertiesModal.vue'

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
            const properties = await showModal(ShiftEventPropertiesModal, {
                shiftEventProperties,
            })
            if (!properties) return

            setShiftEventProperties(properties)
        } else {
            switchToolTo('shiftEvent')

            notify(() => i18n.value.commands.shiftEvent.switched)
        }
    },
}
