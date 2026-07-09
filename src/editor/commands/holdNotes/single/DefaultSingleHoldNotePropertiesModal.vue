<script setup lang="ts">
import { i18n } from '../../../../i18n'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import DefaultSingleHoldNotePropertiesFields from '../../../tools/holdNotes/single/DefaultSingleHoldNotePropertiesFields.vue'
</script>

<template>
    <PropertiesModal :title="i18n.commands.singleHoldNote.modal.title">
        <DefaultSingleHoldNotePropertiesFields />
    </PropertiesModal>
</template>
