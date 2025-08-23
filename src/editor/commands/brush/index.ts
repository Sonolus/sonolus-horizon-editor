import type { Command } from '..'
import { i18n } from '../../../i18n'
import { showModal } from '../../../modals'
import { notify } from '../../notification'
import { switchToolTo } from '../../tools'
import { brushProperties, setBrushProperties } from '../../tools/brush'
import BrushIcon from './BrushIcon.vue'
import BrushPropertiesModal from './BrushPropertiesModal.vue'

export const brush: Command = {
    title: () => i18n.value.commands.brush.title,
    icon: {
        is: BrushIcon,
    },

    async execute() {
        switchToolTo('brush')

        notify(() => i18n.value.commands.brush.switched)

        const properties = await showModal(BrushPropertiesModal, {
            properties: brushProperties,
        })
        if (!properties) return

        setBrushProperties(properties)
    },
}
