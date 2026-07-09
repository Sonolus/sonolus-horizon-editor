<script setup lang="ts">
import { i18n } from '../../../i18n'
import BaseSidebar from '../../sidebars/BaseSidebar.vue'
import DefaultTapNotePropertiesFields from './DefaultTapNotePropertiesFields.vue'
</script>

<template>
    <BaseSidebar :title="i18n.tools.tapNote.sidebar.title">
        <DefaultTapNotePropertiesFields />
    </BaseSidebar>
</template>
