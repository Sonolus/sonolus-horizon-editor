import type { Command } from '..'
import { walkEntities } from '../../../history/store'
import { i18n } from '../../../i18n'
import { focusViewAtBeat } from '../../view'
import JumpDownIcon from './JumpDownIcon.vue'

export const jumpDown: Command = {
    title: () => i18n.value.commands.jumpDown.title,
    icon: {
        is: JumpDownIcon,
    },

    execute() {
        let beat = Number.POSITIVE_INFINITY
        walkEntities((entity) => {
            if (entity.beat < beat) beat = entity.beat
        })

        focusViewAtBeat(beat)
    },
}
