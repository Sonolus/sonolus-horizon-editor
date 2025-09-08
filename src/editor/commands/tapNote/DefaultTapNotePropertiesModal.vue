<script setup lang="ts">
import { i18n } from '../../../i18n'
import OptionalColorField from '../../../modals/form/OptionalColorField.vue'
import PropertiesModal from '../../../modals/form/PropertiesModal.vue'
import { defaultTapNoteProperties, setDefaultTapNoteProperties } from '../../tools/tapNote'
import { useProperties } from '../../utils/properties'

const createModel = useProperties(() => defaultTapNoteProperties, setDefaultTapNoteProperties)

const color = createModel('color')
</script>

<template>
    <PropertiesModal :title="i18n.commands.tapNote.modal.title">
        <OptionalColorField v-model="color" />
    </PropertiesModal>
</template>
