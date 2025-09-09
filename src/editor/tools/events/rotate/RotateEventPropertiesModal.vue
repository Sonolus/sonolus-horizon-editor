<script setup lang="ts">
import { i18n } from '../../../../i18n'
import MultiBeatField from '../../../../modals/form/MultiBeatField.vue'
import MultiEaseField from '../../../../modals/form/MultiEaseField.vue'
import MultiRotateValueField from '../../../../modals/form/MultiRotateValueField.vue'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import { useSelectedEntitiesProperties } from '../../../utils/properties'

const { createModel } = useSelectedEntitiesProperties(
    (entity) => entity.type === 'rotateEventJoint',
)

const value = createModel('value')
const ease = createModel('ease')
const beat = createModel('beat')
</script>

<template>
    <PropertiesModal :title="i18n.tools.events.modals.rotateEvent.title">
        <MultiRotateValueField v-model="value" />
        <MultiEaseField v-model="ease" />
        <MultiBeatField v-model="beat" />
    </PropertiesModal>
</template>
