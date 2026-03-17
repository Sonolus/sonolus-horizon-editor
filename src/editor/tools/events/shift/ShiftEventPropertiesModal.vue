<script setup lang="ts">
import { i18n } from '../../../../i18n'
import MultiBeatField from '../../../../modals/form/MultiBeatField.vue'
import MultiEaseField from '../../../../modals/form/MultiEaseField.vue'
import MultiIgnoreTimeScaleField from '../../../../modals/form/MultiIgnoreTimeScaleField.vue'
import MultiValueField from '../../../../modals/form/MultiValueField.vue'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import { useSelectedEntitiesProperties } from '../../../utils/properties'

const { createModel } = useSelectedEntitiesProperties((entity) => entity.type === 'shiftEventJoint')

const value = createModel('value')
const ease = createModel('ease')
const ignoreTimeScale = createModel('ignoreTimeScale')
const beat = createModel('beat')
</script>

<template>
    <PropertiesModal :title="i18n.tools.events.modals.shiftEvent.title">
        <MultiValueField v-model="value" />
        <MultiEaseField v-model="ease" />
        <MultiIgnoreTimeScaleField v-model="ignoreTimeScale" />
        <MultiBeatField v-model="beat" />
    </PropertiesModal>
</template>
