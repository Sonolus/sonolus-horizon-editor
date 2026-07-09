<script setup lang="ts">
import { i18n } from '../../../../i18n'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import DefaultDoubleHoldNotePropertiesFields from '../../../tools/holdNotes/double/DefaultDoubleHoldNotePropertiesFields.vue'
</script>

<template>
    <PropertiesModal :title="i18n.commands.doubleHoldNote.modal.title">
        <DefaultDoubleHoldNotePropertiesFields />
    </PropertiesModal>
</template>
