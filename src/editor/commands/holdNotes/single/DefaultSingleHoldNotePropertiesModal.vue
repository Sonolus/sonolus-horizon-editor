<script setup lang="ts">
import { i18n } from '../../../../i18n'
import OptionalColorField from '../../../../modals/form/OptionalColorField.vue'
import OptionalScaleLField from '../../../../modals/form/OptionalScaleLField.vue'
import OptionalScaleRField from '../../../../modals/form/OptionalScaleRField.vue'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import {
    defaultSingleHoldNoteProperties,
    setDefaultSingleHoldNoteProperties,
} from '../../../tools/holdNotes/single'
import { useProperties } from '../../../utils/properties'

const createModel = useProperties(
    () => defaultSingleHoldNoteProperties,
    setDefaultSingleHoldNoteProperties,
)

const color = createModel('color')
const scaleL = createModel('scaleL')
const scaleR = createModel('scaleR')
</script>

<template>
    <PropertiesModal :title="i18n.commands.singleHoldNote.modal.title">
        <OptionalColorField v-model="color" />
        <OptionalScaleLField v-model="scaleL" />
        <OptionalScaleRField v-model="scaleR" />
    </PropertiesModal>
</template>
