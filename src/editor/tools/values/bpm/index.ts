import { createValueTool } from '..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { toBpmEntity } from '../../../../state/entities/values/bpm'
import { addBpm, removeBpm } from '../../../../state/mutations/values/bpm'
import BpmPropertiesModal from './BpmPropertiesModal.vue'

export const [bpm, editBpm, editSelectedBpm] = createValueTool(
    () => i18n.value.tools.values.types.bpm,
    () => showModal(BpmPropertiesModal, {}),

    60,

    'bpm',
    toBpmEntity,
    addBpm,
    removeBpm,
)
