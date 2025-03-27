<script setup lang="ts">
import { computed } from 'vue'
import { rotate, shift } from './events'
import { getLane, getLaneCenter, laneLayout } from './lane'
import { transform } from './projection'

const lanes = computed(() =>
    [...Array(8).keys()].map((i) => ({
        points: laneLayout(...getLane(i, 1, shift.value, rotate.value)),
        center: transform(getLaneCenter(i, 1, shift.value, rotate.value), 1),
    })),
)
</script>

<template>
    <template v-for="({ points, center: { x, y } }, index) in lanes" :key="index">
        <polygon :points stroke="white" />
        <text
            :x
            :y
            text-anchor="middle"
            dominant-baseline="middle"
            :transform-origin="`${x} ${y}`"
            transform="scale(1, -1)"
            fill="#fff"
            fill-opacity="0.5"
        >
            {{ index }}
        </text>
    </template>
</template>
