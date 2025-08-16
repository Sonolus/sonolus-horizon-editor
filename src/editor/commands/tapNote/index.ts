import type { Command } from '..'
import { i18n } from '../../../i18n'
import { showModal } from '../../../modals'
import { notify } from '../../notification'
import { switchToolTo, toolName } from '../../tools'
import { setTapNoteProperties, tapNoteProperties } from '../../tools/tapNote'
import TapNoteIcon from './TapNoteIcon.vue'
import TapNotePropertiesModal from './TapNotePropertiesModal.vue'

export const tapNote: Command = {
    title: () => i18n.value.commands.tapNote.title,
    icon: {
        is: TapNoteIcon,
    },

    async execute() {
        if (toolName.value === 'tapNote') {
            const properties = await showModal(TapNotePropertiesModal, {
                tapNoteProperties,
            })
            if (!properties) return

            setTapNoteProperties(properties)
        } else {
            switchToolTo('tapNote')

            notify(() => i18n.value.commands.tapNote.switched)
        }
    },
}
