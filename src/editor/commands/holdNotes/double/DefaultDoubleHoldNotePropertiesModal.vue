<script setup lang="ts">
import { i18n } from '../../../../i18n'
import OptionalColorField from '../../../../modals/form/OptionalColorField.vue'
import OptionalSizeField from '../../../../modals/form/OptionalSizeField.vue'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import {
    defaultDoubleHoldNoteProperties,
    setDefaultDoubleHoldNoteProperties,
} from '../../../tools/holdNotes/double'
import { useProperties } from '../../../utils/properties'

const createModel = useProperties(
    () => defaultDoubleHoldNoteProperties,
    setDefaultDoubleHoldNoteProperties,
)

const color = createModel('color')
const size = createModel('size')
</script>

<template>
    <PropertiesModal :title="i18n.commands.doubleHoldNote.modal.title">
        <OptionalColorField v-model="color" />
        <OptionalSizeField v-model="size" />
    </PropertiesModal>
</template>
