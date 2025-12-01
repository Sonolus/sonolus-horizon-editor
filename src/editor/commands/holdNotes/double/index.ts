import type { Command } from '../..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { notify } from '../../../notification'
import { isSidebarVisible } from '../../../sidebars'
import { switchToolTo, toolName } from '../../../tools'
import DefaultDoubleHoldNotePropertiesModal from './DefaultDoubleHoldNotePropertiesModal.vue'
import DoubleHoldNoteIcon from './DoubleHoldNoteIcon.vue'

export const doubleHoldNote: Command = {
    title: () => i18n.value.commands.doubleHoldNote.title,
    icon: {
        is: DoubleHoldNoteIcon,
    },

    execute() {
        if (toolName.value === 'doubleHoldNote') {
            if (!isSidebarVisible.value) {
                void showModal(DefaultDoubleHoldNotePropertiesModal, {})
            }
        } else {
            switchToolTo('doubleHoldNote')

            notify(() => i18n.value.commands.doubleHoldNote.switched)
        }
    },
}
