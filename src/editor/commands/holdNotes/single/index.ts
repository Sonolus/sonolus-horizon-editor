import type { Command } from '../..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { notify } from '../../../notification'
import { isSidebarVisible } from '../../../sidebars'
import { switchToolTo, toolName } from '../../../tools'
import DefaultSingleHoldNotePropertiesModal from './DefaultSingleHoldNotePropertiesModal.vue'
import SingleHoldNoteIcon from './SingleHoldNoteIcon.vue'

export const singleHoldNote: Command = {
    title: () => i18n.value.commands.singleHoldNote.title,
    icon: {
        is: SingleHoldNoteIcon,
    },

    execute() {
        if (toolName.value === 'singleHoldNote') {
            if (!isSidebarVisible.value) {
                void showModal(DefaultSingleHoldNotePropertiesModal, {})
            }
        } else {
            switchToolTo('singleHoldNote')

            notify(() => i18n.value.commands.singleHoldNote.switched)
        }
    },
}
