import type { Command } from '../..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { notify } from '../../../notification'
import { switchToolTo, toolName } from '../../../tools'
import {
    doubleHoldNoteProperties,
    setDoubleHoldNoteProperties,
} from '../../../tools/holdNotes/double'
import DoubleHoldNotePropertiesModal from '../double/DoubleHoldNotePropertiesModal.vue'
import DoubleHoldNoteIcon from './DoubleHoldNoteIcon.vue'

export const doubleHoldNote: Command = {
    title: () => i18n.value.commands.doubleHoldNote.title,
    icon: {
        is: DoubleHoldNoteIcon,
    },

    async execute() {
        if (toolName.value === 'doubleHoldNote') {
            const properties = await showModal(DoubleHoldNotePropertiesModal, {
                doubleHoldNoteProperties,
            })
            if (!properties) return

            setDoubleHoldNoteProperties(properties)
        } else {
            switchToolTo('doubleHoldNote')

            notify(() => i18n.value.commands.doubleHoldNote.switched)
        }
    },
}
