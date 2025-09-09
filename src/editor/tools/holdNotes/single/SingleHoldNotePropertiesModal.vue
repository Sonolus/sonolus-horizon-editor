<script setup lang="ts">
import { i18n } from '../../../../i18n'
import MultiBeatField from '../../../../modals/form/MultiBeatField.vue'
import MultiColorField from '../../../../modals/form/MultiColorField.vue'
import MultiLaneField from '../../../../modals/form/MultiLaneField.vue'
import MultiScaleLField from '../../../../modals/form/MultiScaleLField.vue'
import MultiScaleRField from '../../../../modals/form/MultiScaleRField.vue'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import { useSelectedEntitiesProperties } from '../../../utils/properties'

const { createModel } = useSelectedEntitiesProperties(
    (entity) => entity.type === 'singleHoldNoteJoint',
)

const color = createModel('color')
const lane = createModel('lane')
const beat = createModel('beat')
const scaleL = createModel('scaleL')
const scaleR = createModel('scaleR')
</script>

<template>
    <PropertiesModal :title="i18n.tools.holdNotes.modals.singleHoldNote.title">
        <MultiColorField v-model="color" />
        <MultiLaneField v-model="lane" />
        <MultiBeatField v-model="beat" />
        <MultiScaleLField v-model="scaleL" />
        <MultiScaleRField v-model="scaleR" />
    </PropertiesModal>
</template>
