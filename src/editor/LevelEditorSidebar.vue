<script setup lang="ts">
import DefaultSidebar from './sidebars/DefaultSidebar.vue'
import { tool } from './tools'
</script>

<template>
    <component :is="tool.sidebar ?? DefaultSidebar" />
</template>
