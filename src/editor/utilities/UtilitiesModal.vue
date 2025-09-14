<script setup lang="ts">
import { i18n } from '../../i18n'
import { showModal } from '../../modals'
import BaseModal from '../../modals/BaseModal.vue'
import CoverEditorModal from './coverEditor/CoverEditorModal.vue'

const utilities = {
    coverEditor: CoverEditorModal,
}
</script>

<template>
    <BaseModal :title="i18n.utilities.title">
        <button
            v-for="(modal, name) in utilities"
            :key="name"
            class="bg-[#222] px-2 py-1 transition-colors hover:bg-[#444] active:bg-[#111]"
            @click="showModal(modal, {})"
        >
            {{ i18n.utilities[name].title }}
        </button>
    </BaseModal>
</template>
