<script setup lang="ts">
import { i18n } from '../../../../i18n'
import MultiBeatField from '../../../../modals/form/MultiBeatField.vue'
import MultiColorField from '../../../../modals/form/MultiColorField.vue'
import MultiLaneLField from '../../../../modals/form/MultiLaneLField.vue'
import MultiLaneRField from '../../../../modals/form/MultiLaneRField.vue'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import { useSelectedEntitiesProperties } from '../../../utils/properties'

const { createModel } = useSelectedEntitiesProperties(
    (entity) => entity.type === 'doubleHoldNoteJoint',
)

const color = createModel('color')
const laneL = createModel('laneL')
const laneR = createModel('laneR')
const beat = createModel('beat')
</script>

<template>
    <PropertiesModal :title="i18n.tools.holdNotes.modals.doubleHoldNote.title">
        <MultiColorField v-model="color" />
        <MultiLaneLField v-model="laneL" />
        <MultiLaneRField v-model="laneR" />
        <MultiBeatField v-model="beat" />
    </PropertiesModal>
</template>
