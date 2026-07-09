<script setup lang="ts">
import { i18n } from '../../../i18n'
import PropertiesModal from '../../../modals/form/PropertiesModal.vue'
import DefaultTapNotePropertiesFields from '../../tools/tapNote/DefaultTapNotePropertiesFields.vue'
</script>

<template>
    <PropertiesModal :title="i18n.commands.tapNote.modal.title">
        <DefaultTapNotePropertiesFields />
    </PropertiesModal>
</template>
