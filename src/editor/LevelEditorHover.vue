<script setup lang="ts">
import { view, viewBox } from './view'
</script>

<template>
    <line
        :transform="`translate(0, ${view.hoverTime * viewBox.ups})`"
        :x1="-4"
        :x2="4"
        y1="0"
        y2="0"
        stroke="#fff"
        stroke-opacity="0.5"
        stroke-dasharray="6 4"
    />
</template>
