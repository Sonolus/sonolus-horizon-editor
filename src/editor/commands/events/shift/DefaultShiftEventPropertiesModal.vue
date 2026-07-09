<script setup lang="ts">
import { i18n } from '../../../../i18n'
import PropertiesModal from '../../../../modals/form/PropertiesModal.vue'
import DefaultShiftEventPropertiesFields from '../../../tools/events/shift/DefaultShiftEventPropertiesFields.vue'
</script>

<template>
    <PropertiesModal :title="i18n.commands.shiftEvent.modal.title">
        <DefaultShiftEventPropertiesFields />
    </PropertiesModal>
</template>
