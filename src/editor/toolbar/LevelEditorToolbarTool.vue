<script setup lang="ts">
import { computed } from 'vue'
import { settings } from '../../settings'
import { formatShortcut } from '../../utils/format'
import { commands, type CommandName } from '../commands'

const props = defineProps<{
    name: CommandName
    showLabel?: boolean
}>()

const title = computed(() => commands[props.name].title())

const shortcut = computed(() => formatShortcut(settings.keyboardShortcuts[props.name]))
</script>

<template>
    <button
        class="flex items-center bg-[#222] p-2 transition-colors hover:bg-[#444] active:bg-[#111]"
        :title
    >
        <component :is="commands[name].icon.is" class="size-4" v-bind="commands[name].icon.props" />
        <template v-if="showLabel">
            <span class="ml-2 flex-grow text-left text-sm">{{ title }}</span>
            <span v-if="shortcut" class="ml-4 text-xs text-white/50">{{ shortcut }}</span>
        </template>
    </button>
</template>
