<script setup lang="ts">
import { i18n } from '../../../../i18n'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'
import DefaultRotateEventPropertiesFields from './DefaultRotateEventPropertiesFields.vue'
</script>

<template>
    <BaseSidebar :title="i18n.tools.events.sidebars.rotateEvent.title">
        <DefaultRotateEventPropertiesFields />
    </BaseSidebar>
</template>
