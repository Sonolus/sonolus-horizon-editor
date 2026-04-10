<script setup lang="ts">
import { commands, type CommandName } from '../commands'

defineProps<{
    name: CommandName
    showLabel?: boolean
}>()
</script>

<template>
    <button
        class="flex items-center gap-2 bg-[#222] p-2 transition-colors hover:bg-[#444] active:bg-[#111]"
        :title="commands[name].title()"
    >
        <component :is="commands[name].icon.is" class="size-4" v-bind="commands[name].icon.props" />
        <span v-if="showLabel" class="text-sm">{{ commands[name].title() }}</span>
    </button>
</template>
