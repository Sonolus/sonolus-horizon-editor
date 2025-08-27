<script setup lang="ts">
import { clipboardEntryNames, setToClipboardEntry } from '.'
import { i18n } from '../../../i18n'
import BaseSidebar from '../../sidebars/BaseSidebar.vue'
</script>

<template>
    <BaseSidebar :title="i18n.tools.paste.sidebar.title">
        <button
            v-for="name in clipboardEntryNames"
            :key="name"
            class="bg-[#222] px-2 py-1 transition-colors hover:bg-[#444] active:bg-[#111]"
            @click="setToClipboardEntry(name)"
        >
            {{ name }}
        </button>
    </BaseSidebar>
</template>
