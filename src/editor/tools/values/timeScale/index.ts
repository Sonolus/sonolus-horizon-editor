import { createValueTool } from '..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { toTimeScaleEntity } from '../../../../state/entities/values/timeScale'
import { addTimeScale, removeTimeScale } from '../../../../state/mutations/values/timeScale'
import TimeScalePropertiesModal from './TimeScalePropertiesModal.vue'

export const [timeScale, editTimeScale, editSelectedTimeScale] = createValueTool(
    () => i18n.value.tools.values.types.timeScale,
    (object) => showModal(TimeScalePropertiesModal, { object }),

    1,

    'timeScale',
    toTimeScaleEntity,
    addTimeScale,
    removeTimeScale,
)
