<script setup lang="ts">
import { isEditableEntity } from '.'
import { i18n } from '../../../i18n'
import MultiBeatField from '../../../modals/form/MultiBeatField.vue'
import MultiBpmField from '../../../modals/form/MultiBpmField.vue'
import MultiColorField from '../../../modals/form/MultiColorField.vue'
import MultiEaseField from '../../../modals/form/MultiEaseField.vue'
import MultiLaneField from '../../../modals/form/MultiLaneField.vue'
import MultiLaneLField from '../../../modals/form/MultiLaneLField.vue'
import MultiLaneRField from '../../../modals/form/MultiLaneRField.vue'
import MultiRotateValueField from '../../../modals/form/MultiRotateValueField.vue'
import MultiScaleLField from '../../../modals/form/MultiScaleLField.vue'
import MultiScaleRField from '../../../modals/form/MultiScaleRField.vue'
import MultiTimeScaleField from '../../../modals/form/MultiTimeScaleField.vue'
import MultiValueField from '../../../modals/form/MultiValueField.vue'
import { useSelectedEntitiesProperties } from '../../utils/properties'
import BaseSidebar from '../BaseSidebar.vue'

const { entities, types, createModel } = useSelectedEntitiesProperties(isEditableEntity)

const beat = createModel('beat')
const value = createModel('value')
const ease = createModel('ease')
const color = createModel('color')
const lane = createModel('lane')
const scaleL = createModel('scaleL')
const scaleR = createModel('scaleR')
const laneL = createModel('laneL')
const laneR = createModel('laneR')
</script>

<template>
    <BaseSidebar :title="i18n.sidebar.default.title">
        <div v-if="!entities.length">{{ i18n.sidebar.default.none }}</div>
        <template v-else>
            <MultiBpmField v-if="types.bpm" v-model="value" />
            <MultiTimeScaleField v-if="types.timeScale" v-model="value" />
            <MultiRotateValueField v-if="types.rotateEventJoint" v-model="value" />
            <MultiValueField v-if="types.shiftEventJoint || types.zoomEventJoint" v-model="value" />
            <MultiEaseField
                v-if="types.rotateEventJoint || types.shiftEventJoint || types.zoomEventJoint"
                v-model="ease"
            />
            <MultiColorField
                v-if="types.tapNote || types.singleHoldNoteJoint || types.doubleHoldNoteJoint"
                v-model="color"
            />
            <MultiLaneField
                v-if="entities.length === 1 && (types.tapNote || types.singleHoldNoteJoint)"
                v-model="lane"
            />
            <MultiLaneLField
                v-if="entities.length === 1 && types.doubleHoldNoteJoint"
                v-model="laneL"
            />
            <MultiLaneRField
                v-if="entities.length === 1 && types.doubleHoldNoteJoint"
                v-model="laneR"
            />
            <MultiBeatField v-if="entities.length === 1" v-model="beat" />
            <MultiScaleLField v-if="types.singleHoldNoteJoint" v-model="scaleL" />
            <MultiScaleRField v-if="types.singleHoldNoteJoint" v-model="scaleR" />
        </template>
    </BaseSidebar>
</template>
