<script setup lang="ts">
import { defaultDoubleHoldNoteProperties, setDefaultDoubleHoldNoteProperties } from '.'
import { i18n } from '../../../../i18n'
import OptionalColorField from '../../../../modals/form/OptionalColorField.vue'
import OptionalSizeField from '../../../../modals/form/OptionalSizeField.vue'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'
import { useProperties } from '../../../utils/properties'

const createModel = useProperties(
    () => defaultDoubleHoldNoteProperties,
    setDefaultDoubleHoldNoteProperties,
)

const color = createModel('color')
const size = createModel('size')
</script>

<template>
    <BaseSidebar :title="i18n.tools.holdNotes.sidebars.doubleHoldNote.title">
        <OptionalColorField v-model="color" />
        <OptionalSizeField v-model="size" />
    </BaseSidebar>
</template>
