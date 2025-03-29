<script setup lang="ts">
import { computed } from 'vue'
import { view } from '../editor/view'
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
            :y="-y"
            text-anchor="middle"
            dominant-baseline="middle"
            transform="scale(1, -1)"
            fill="white"
            :fill-opacity="index === view.hoverLane ? 1 : 0.5"
        >
            {{ index }}
        </text>
    </template>
</template>
