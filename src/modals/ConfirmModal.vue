<script setup lang="ts">
import { i18n } from '../i18n'
import BaseModal from './BaseModal.vue'

defineProps<{
    title: () => string
    message: () => string
}>()

defineEmits<{
    close: [result: boolean]
}>()
</script>

<template>
    <BaseModal :title="title()" @close="$emit('close', false)">
        <div>{{ message() }}</div>

        <div class="flex justify-end gap-2">
            <button
                class="w-32 bg-[#222] px-2 py-1 transition-colors hover:bg-[#444] active:bg-[#111]"
                @click="$emit('close', true)"
            >
                {{ i18n.modals.confirm.confirm }}
            </button>
            <button
                class="w-32 bg-[#222] px-2 py-1 transition-colors hover:bg-[#444] active:bg-[#111]"
                @click="$emit('close', false)"
            >
                {{ i18n.modals.confirm.cancel }}
            </button>
        </div>
    </BaseModal>
</template>
