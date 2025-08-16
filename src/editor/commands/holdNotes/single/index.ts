import type { Command } from '../..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { notify } from '../../../notification'
import { switchToolTo, toolName } from '../../../tools'
import {
    setSingleHoldNoteProperties,
    singleHoldNoteProperties,
} from '../../../tools/holdNotes/single'
import SingleHoldNoteIcon from './SingleHoldNoteIcon.vue'
import SingleHoldNotePropertiesModal from './SingleHoldNotePropertiesModal.vue'

export const singleHoldNote: Command = {
    title: () => i18n.value.commands.singleHoldNote.title,
    icon: {
        is: SingleHoldNoteIcon,
    },

    async execute() {
        if (toolName.value === 'singleHoldNote') {
            const properties = await showModal(SingleHoldNotePropertiesModal, {
                singleHoldNoteProperties,
            })
            if (!properties) return

            setSingleHoldNoteProperties(properties)
        } else {
            switchToolTo('singleHoldNote')

            notify(() => i18n.value.commands.singleHoldNote.switched)
        }
    },
}
