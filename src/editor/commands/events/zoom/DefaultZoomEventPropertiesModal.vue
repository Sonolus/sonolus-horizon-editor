<script setup lang="ts">
import { i18n } from '../../../../i18n'
import CopyPropertiesField from '../../../../modals/form/CopyPropertiesField.vue'
import OptionalEaseField from '../../../../modals/form/OptionalEaseField.vue'
import OptionalIgnoreTimeScaleField from '../../../../modals/form/OptionalIgnoreTimeScaleField.vue'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import { defaultZoomEventProperties } from '../../../tools/events/zoom'
import { useProperties } from '../../../utils/properties'

const createModel = useProperties(defaultZoomEventProperties)

const ease = createModel('ease')
const ignoreTimeScale = createModel('ignoreTimeScale')
const copyProperties = createModel('copyProperties')
</script>

<template>
    <PropertiesModal :title="i18n.commands.zoomEvent.modal.title">
        <OptionalEaseField v-model="ease" />
        <OptionalIgnoreTimeScaleField v-model="ignoreTimeScale" />
        <CopyPropertiesField v-model="copyProperties" />
    </PropertiesModal>
</template>
