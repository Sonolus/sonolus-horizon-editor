<script setup lang="ts">
import { colors } from '../../../colors'
</script>

<template>
    <svg viewBox="-0.55 -0.55 1.1 1.1">
        <rect x="-0.5" y="-0.5" width="1" height="1" :fill="colors[0]" fill-opacity="0.25" />
        <polygon
            points="-0.5 0.1 0 -0.25 0.5 0.1"
            stroke="#fff"
            stroke-width="0.05"
            :fill="colors[0]"
            fill-opacity="0.5"
        />
        <polygon
            points="-0.5 0.3 0 -0.05 0.5 0.3"
            stroke="#fff"
            stroke-width="0.05"
            :fill="colors[0]"
            fill-opacity="0.5"
        />
        <polygon
            points="-0.5 0.5 0 0.15 0.5 0.5"
            stroke="#fff"
            stroke-width="0.05"
            :fill="colors[0]"
            fill-opacity="0.5"
        />
    </svg>
</template>
