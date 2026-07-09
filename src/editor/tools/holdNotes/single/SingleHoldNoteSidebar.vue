<script setup lang="ts">
import { i18n } from '../../../../i18n'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'
import DefaultSingleHoldNotePropertiesFields from './DefaultSingleHoldNotePropertiesFields.vue'
</script>

<template>
    <BaseSidebar :title="i18n.tools.holdNotes.sidebars.singleHoldNote.title">
        <DefaultSingleHoldNotePropertiesFields />
    </BaseSidebar>
</template>
