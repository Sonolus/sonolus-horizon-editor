import type { Command } from '..'
import { i18n } from '../../../i18n'
import { notify } from '../../notification'
import { switchToolTo } from '../../tools'
import GenerateHoldNotesIcon from './GenerateHoldNotesIcon.vue'

export const generateHoldNotes: Command = {
    title: () => i18n.value.commands.generateHoldNotes.title,
    icon: {
        is: GenerateHoldNotesIcon,
    },

    execute() {
        switchToolTo('generateHoldNotes')

        notify(() => i18n.value.commands.generateHoldNotes.switched)
    },
}
