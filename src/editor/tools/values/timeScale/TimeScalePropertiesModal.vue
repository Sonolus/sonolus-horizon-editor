<script setup lang="ts">
import { i18n } from '../../../../i18n'
import MultiBeatField from '../../../../modals/form/MultiBeatField.vue'
import MultiTimeScaleField from '../../../../modals/form/MultiTimeScaleField.vue'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import { useSelectedEntitiesProperties } from '../../../utils/properties'

const { createModel } = useSelectedEntitiesProperties((entity) => entity.type === 'timeScale')

const value = createModel('value')
const beat = createModel('beat')
</script>

<template>
    <PropertiesModal :title="i18n.tools.values.modals.timeScale.title">
        <MultiTimeScaleField v-model="value" />
        <MultiBeatField v-model="beat" />
    </PropertiesModal>
</template>
