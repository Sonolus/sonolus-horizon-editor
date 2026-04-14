<script setup lang="ts">
import { defaultDoubleHoldNoteProperties } from '.'
import { i18n } from '../../../../i18n'
import CopyPropertiesField from '../../../../modals/form/CopyPropertiesField.vue'
import OptionalColorField from '../../../../modals/form/OptionalColorField.vue'
import OptionalSizeField from '../../../../modals/form/OptionalSizeField.vue'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'
import { useProperties } from '../../../utils/properties'

const createModel = useProperties(defaultDoubleHoldNoteProperties)

const color = createModel('color')
const size = createModel('size')
const copyProperties = createModel('copyProperties')
</script>

<template>
    <BaseSidebar :title="i18n.tools.holdNotes.sidebars.doubleHoldNote.title">
        <OptionalColorField v-model="color" />
        <OptionalSizeField v-model="size" />
        <CopyPropertiesField v-model="copyProperties" />
    </BaseSidebar>
</template>
