<script setup lang="ts">
import { i18n } from '../../../../i18n'
import CopyPropertiesField from '../../../../modals/form/CopyPropertiesField.vue'
import OptionalColorField from '../../../../modals/form/OptionalColorField.vue'
import OptionalSizeField from '../../../../modals/form/OptionalSizeField.vue'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import { defaultDoubleHoldNoteProperties } from '../../../tools/holdNotes/double'
import { useProperties } from '../../../utils/properties'

const createModel = useProperties(defaultDoubleHoldNoteProperties)

const color = createModel('color')
const size = createModel('size')
const copyProperties = createModel('copyProperties')
</script>

<template>
    <PropertiesModal :title="i18n.commands.doubleHoldNote.modal.title">
        <OptionalColorField v-model="color" />
        <OptionalSizeField v-model="size" />
        <CopyPropertiesField v-model="copyProperties" />
    </PropertiesModal>
</template>
