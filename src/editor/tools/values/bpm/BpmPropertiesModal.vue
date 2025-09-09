<script setup lang="ts">
import { i18n } from '../../../../i18n'
import MultiBeatField from '../../../../modals/form/MultiBeatField.vue'
import MultiBpmField from '../../../../modals/form/MultiBpmField.vue'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import { useSelectedEntitiesProperties } from '../../../utils/properties'

const { createModel } = useSelectedEntitiesProperties((entity) => entity.type === 'bpm')

const value = createModel('value')
const beat = createModel('beat')
</script>

<template>
    <PropertiesModal :title="i18n.tools.values.modals.bpm.title">
        <MultiBpmField v-model="value" />
        <MultiBeatField v-model="beat" />
    </PropertiesModal>
</template>
