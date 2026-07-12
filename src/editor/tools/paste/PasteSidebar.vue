<script setup lang="ts">
import { clipboardEntries, setClipboardEntry } from '../../../clipboard/index.ts'
import { i18n } from '../../../i18n'
import BaseSidebar from '../../sidebars/BaseSidebar.vue'
</script>

<template>
    <BaseSidebar :title="i18n.tools.paste.sidebar.title">
        <template v-for="entry in clipboardEntries" :key="entry.name">
            <button
                v-if="entry.data"
                class="bg-[#222] px-2 py-1 transition-colors hover:bg-[#444] active:bg-[#111]"
                @click="setClipboardEntry(entry)"
            >
                {{ entry.name }}
            </button>
        </template>
    </BaseSidebar>
</template>
