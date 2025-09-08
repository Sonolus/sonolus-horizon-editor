<script setup lang="ts">
import { i18n } from '../../../../i18n'
import OptionalEaseField from '../../../../modals/form/OptionalEaseField.vue'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import {
    defaultZoomEventProperties,
    setDefaultZoomEventProperties,
} from '../../../tools/events/zoom'
import { useProperties } from '../../../utils/properties'

const createModel = useProperties(() => defaultZoomEventProperties, setDefaultZoomEventProperties)

const ease = createModel('ease')
</script>

<template>
    <PropertiesModal :title="i18n.commands.zoomEvent.modal.title">
        <OptionalEaseField v-model="ease" />
    </PropertiesModal>
</template>
