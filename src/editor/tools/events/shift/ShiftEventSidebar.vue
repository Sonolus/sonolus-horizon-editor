<script setup lang="ts">
import { i18n } from '../../../../i18n'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'
import DefaultShiftEventPropertiesFields from './DefaultShiftEventPropertiesFields.vue'
</script>

<template>
    <BaseSidebar :title="i18n.tools.events.sidebars.shiftEvent.title">
        <DefaultShiftEventPropertiesFields />
    </BaseSidebar>
</template>
