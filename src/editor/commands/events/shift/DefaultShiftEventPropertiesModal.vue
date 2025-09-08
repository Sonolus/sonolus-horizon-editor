<script setup lang="ts">
import { i18n } from '../../../../i18n'
import OptionalEaseField from '../../../../modals/form/OptionalEaseField.vue'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import {
    defaultShiftEventProperties,
    setDefaultShiftEventProperties,
} from '../../../tools/events/shift'
import { useProperties } from '../../../utils/properties'

const createModel = useProperties(() => defaultShiftEventProperties, setDefaultShiftEventProperties)

const ease = createModel('ease')
</script>

<template>
    <PropertiesModal :title="i18n.commands.shiftEvent.modal.title">
        <OptionalEaseField v-model="ease" />
    </PropertiesModal>
</template>
