<script setup lang="ts">
import { i18n } from '../../../../i18n'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'
import DefaultDoubleHoldNotePropertiesFields from './DefaultDoubleHoldNotePropertiesFields.vue'
</script>

<template>
    <BaseSidebar :title="i18n.tools.holdNotes.sidebars.doubleHoldNote.title">
        <DefaultDoubleHoldNotePropertiesFields />
    </BaseSidebar>
</template>
