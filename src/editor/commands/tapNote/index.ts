import type { Command } from '..'
import { i18n } from '../../../i18n'
import { showModal } from '../../../modals'
import { notify } from '../../notification'
import { switchToolTo, toolName } from '../../tools'
import { defaultTapNoteProperties, setDefaultTapNoteProperties } from '../../tools/tapNote'
import DefaultTapNotePropertiesModal from './DefaultTapNotePropertiesModal.vue'
import TapNoteIcon from './TapNoteIcon.vue'

export const tapNote: Command = {
    title: () => i18n.value.commands.tapNote.title,
    icon: {
        is: TapNoteIcon,
    },

    async execute() {
        if (toolName.value === 'tapNote') {
            const properties = await showModal(DefaultTapNotePropertiesModal, {
                properties: defaultTapNoteProperties,
            })
            if (!properties) return

            setDefaultTapNoteProperties(properties)
        } else {
            switchToolTo('tapNote')

            notify(() => i18n.value.commands.tapNote.switched)
        }
    },
}
