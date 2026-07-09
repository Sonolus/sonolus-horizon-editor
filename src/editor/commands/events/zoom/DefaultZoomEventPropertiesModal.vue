<script setup lang="ts">
import { i18n } from '../../../../i18n'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import DefaultZoomEventPropertiesFields from '../../../tools/events/zoom/DefaultZoomEventPropertiesFields.vue'
</script>

<template>
    <PropertiesModal :title="i18n.commands.zoomEvent.modal.title">
        <DefaultZoomEventPropertiesFields />
    </PropertiesModal>
</template>
