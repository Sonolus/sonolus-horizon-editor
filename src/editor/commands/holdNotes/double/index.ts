import type { Command } from '../..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { notify } from '../../../notification'
import { switchToolTo, toolName } from '../../../tools'
import {
    defaultDoubleHoldNoteProperties,
    setDefaultDoubleHoldNoteProperties,
} from '../../../tools/holdNotes/double'
import DefaultDoubleHoldNotePropertiesModal from './DefaultDoubleHoldNotePropertiesModal.vue'
import DoubleHoldNoteIcon from './DoubleHoldNoteIcon.vue'

export const doubleHoldNote: Command = {
    title: () => i18n.value.commands.doubleHoldNote.title,
    icon: {
        is: DoubleHoldNoteIcon,
    },

    async execute() {
        if (toolName.value === 'doubleHoldNote') {
            const properties = await showModal(DefaultDoubleHoldNotePropertiesModal, {
                properties: defaultDoubleHoldNoteProperties,
            })
            if (!properties) return

            setDefaultDoubleHoldNoteProperties(properties)
        } else {
            switchToolTo('doubleHoldNote')

            notify(() => i18n.value.commands.doubleHoldNote.switched)
        }
    },
}
