<script setup lang="ts">
import { defaultSingleHoldNoteProperties } from '.'
import { i18n } from '../../../../i18n'
import CopyPropertiesField from '../../../../modals/form/CopyPropertiesField.vue'
import OptionalColorField from '../../../../modals/form/OptionalColorField.vue'
import OptionalScaleLField from '../../../../modals/form/OptionalScaleLField.vue'
import OptionalScaleRField from '../../../../modals/form/OptionalScaleRField.vue'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'
import { useProperties } from '../../../utils/properties'

const createModel = useProperties(defaultSingleHoldNoteProperties)

const color = createModel('color')
const scaleL = createModel('scaleL')
const scaleR = createModel('scaleR')
const copyProperties = createModel('copyProperties')
</script>

<template>
    <BaseSidebar :title="i18n.tools.holdNotes.sidebars.singleHoldNote.title">
        <OptionalColorField v-model="color" />
        <OptionalScaleLField v-model="scaleL" />
        <OptionalScaleRField v-model="scaleR" />
        <CopyPropertiesField v-model="copyProperties" />
    </BaseSidebar>
</template>
