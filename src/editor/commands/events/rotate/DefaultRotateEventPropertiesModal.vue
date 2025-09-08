<script setup lang="ts">
import { i18n } from '../../../../i18n'
import OptionalEaseField from '../../../../modals/form/OptionalEaseField.vue'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import {
    defaultRotateEventProperties,
    setDefaultRotateEventProperties,
} from '../../../tools/events/rotate'
import { useProperties } from '../../../utils/properties'

const createModel = useProperties(
    () => defaultRotateEventProperties,
    setDefaultRotateEventProperties,
)

const ease = createModel('ease')
</script>

<template>
    <PropertiesModal :title="i18n.commands.rotateEvent.modal.title">
        <OptionalEaseField v-model="ease" />
    </PropertiesModal>
</template>
