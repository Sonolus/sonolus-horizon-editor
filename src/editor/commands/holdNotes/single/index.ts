import type { Command } from '../..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { notify } from '../../../notification'
import { switchToolTo, toolName } from '../../../tools'
import {
    defaultSingleHoldNoteProperties,
    setDefaultSingleHoldNoteProperties,
} from '../../../tools/holdNotes/single'
import DefaultSingleHoldNotePropertiesModal from './DefaultSingleHoldNotePropertiesModal.vue'
import SingleHoldNoteIcon from './SingleHoldNoteIcon.vue'

export const singleHoldNote: Command = {
    title: () => i18n.value.commands.singleHoldNote.title,
    icon: {
        is: SingleHoldNoteIcon,
    },

    async execute() {
        if (toolName.value === 'singleHoldNote') {
            const properties = await showModal(DefaultSingleHoldNotePropertiesModal, {
                properties: defaultSingleHoldNoteProperties,
            })
            if (!properties) return

            setDefaultSingleHoldNoteProperties(properties)
        } else {
            switchToolTo('singleHoldNote')

            notify(() => i18n.value.commands.singleHoldNote.switched)
        }
    },
}
