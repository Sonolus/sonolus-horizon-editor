<script setup lang="ts">
import { i18n } from '../../../../i18n'
import OptionalEaseField from '../../../../modals/form/OptionalEaseField.vue'
import OptionalIgnoreTimeScaleField from '../../../../modals/form/OptionalIgnoreTimeScaleField.vue'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import {
    defaultShiftEventProperties,
    setDefaultShiftEventProperties,
} from '../../../tools/events/shift'
import { useProperties } from '../../../utils/properties'

const createModel = useProperties(() => defaultShiftEventProperties, setDefaultShiftEventProperties)

const ease = createModel('ease')
const ignoreTimeScale = createModel('ignoreTimeScale')
</script>

<template>
    <PropertiesModal :title="i18n.commands.shiftEvent.modal.title">
        <OptionalEaseField v-model="ease" />
        <OptionalIgnoreTimeScaleField v-model="ignoreTimeScale" />
    </PropertiesModal>
</template>
