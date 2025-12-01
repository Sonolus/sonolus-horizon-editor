import type { Command } from '..'
import { i18n } from '../../../i18n'
import { showModal } from '../../../modals'
import { notify } from '../../notification'
import { isSidebarVisible } from '../../sidebars'
import { switchToolTo, toolName } from '../../tools'
import DefaultTapNotePropertiesModal from './DefaultTapNotePropertiesModal.vue'
import TapNoteIcon from './TapNoteIcon.vue'

export const tapNote: Command = {
    title: () => i18n.value.commands.tapNote.title,
    icon: {
        is: TapNoteIcon,
    },

    execute() {
        if (toolName.value === 'tapNote') {
            if (!isSidebarVisible.value) {
                void showModal(DefaultTapNotePropertiesModal, {})
            }
        } else {
            switchToolTo('tapNote')

            notify(() => i18n.value.commands.tapNote.switched)
        }
    },
}
