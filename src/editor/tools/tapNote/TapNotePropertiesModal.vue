<script setup lang="ts">
import { i18n } from '../../../i18n'
import MultiBeatField from '../../../modals/form/MultiBeatField.vue'
import MultiColorField from '../../../modals/form/MultiColorField.vue'
import MultiLaneField from '../../../modals/form/MultiLaneField.vue'
import PropertiesModal from '../../../modals/form/PropertiesModal.vue'
import { useSelectedEntitiesProperties } from '../../utils/properties'

const { createModel } = useSelectedEntitiesProperties((entity) => entity.type === 'tapNote')

const color = createModel('color')
const lane = createModel('lane')
const beat = createModel('beat')
</script>

<template>
    <PropertiesModal :title="i18n.tools.tapNote.modal.title">
        <MultiColorField v-model="color" />
        <MultiLaneField v-model="lane" />
        <MultiBeatField v-model="beat" />
    </PropertiesModal>
</template>
