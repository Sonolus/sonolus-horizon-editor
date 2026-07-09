<script setup lang="ts">
import { i18n } from '../../../../i18n'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'
import DefaultZoomEventPropertiesFields from './DefaultZoomEventPropertiesFields.vue'
</script>

<template>
    <BaseSidebar :title="i18n.tools.events.sidebars.zoomEvent.title">
        <DefaultZoomEventPropertiesFields />
    </BaseSidebar>
</template>
