<script setup lang="ts">
import { defaultSingleHoldNoteProperties, setDefaultSingleHoldNoteProperties } from '.'
import { i18n } from '../../../../i18n'
import OptionalColorField from '../../../../modals/form/OptionalColorField.vue'
import OptionalScaleLField from '../../../../modals/form/OptionalScaleLField.vue'
import OptionalScaleRField from '../../../../modals/form/OptionalScaleRField.vue'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'
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
    <BaseSidebar :title="i18n.tools.holdNotes.sidebars.singleHoldNote.title">
        <OptionalColorField v-model="color" />
        <OptionalScaleLField v-model="scaleL" />
        <OptionalScaleRField v-model="scaleR" />
    </BaseSidebar>
</template>
