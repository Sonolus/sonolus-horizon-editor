<script setup lang="ts">
import { computed } from 'vue'
import {
    defaultSingleHoldNoteProperties,
    setDefaultSingleHoldNoteProperties,
    type DefaultSingleHoldNoteProperties,
} from '.'
import { i18n } from '../../../../i18n'
import OptionalColorField from '../../../../modals/form/OptionalColorField.vue'
import OptionalScaleLField from '../../../../modals/form/OptionalScaleLField.vue'
import OptionalScaleRField from '../../../../modals/form/OptionalScaleRField.vue'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'

const createModel = <K extends keyof DefaultSingleHoldNoteProperties>(key: K) =>
    computed({
        get: () => defaultSingleHoldNoteProperties[key],
        set: (value) => {
            setDefaultSingleHoldNoteProperties({ ...defaultSingleHoldNoteProperties, [key]: value })
        },
    })

const color = createModel('color')
const scaleL = createModel('scaleL')
const scaleR = createModel('scaleR')
</script>

<template>
    <BaseSidebar :title="i18n.tools.holdNotes.sidebars.singleHoldNote.title">
        <OptionalColorField v-model="color" />
        <OptionalScaleLField v-model="scaleL" validate />
        <OptionalScaleRField v-model="scaleR" validate />
    </BaseSidebar>
</template>
