<script setup lang="ts">
import { i18n } from '../../../../i18n'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import DefaultRotateEventPropertiesFields from '../../../tools/events/rotate/DefaultRotateEventPropertiesFields.vue'
</script>

<template>
    <PropertiesModal :title="i18n.commands.rotateEvent.modal.title">
        <DefaultRotateEventPropertiesFields />
    </PropertiesModal>
</template>
