<script setup lang="ts">
import { computed } from 'vue'
import { bpms } from '../history/bpms'
import { settings } from '../settings'
import { timeToBeat } from '../state/integrals/bpms'
import { formatBeat, formatTime } from '../utils/format'
import { view, viewBox } from './view'

const hover = computed(() => ({
    top: 0.5 * view.h - (view.hoverTime - view.time) * settings.pps,
    time: view.hoverTime,
    beat: timeToBeat(bpms.value, view.hoverTime),
}))

const width = computed(() => 8 / viewBox.value.w)
</script>

<template>
    <div
        class="absolute flex w-full -translate-y-1/2 justify-between text-white/50"
        :style="{ top: `${hover.top}px` }"
    >
        <span>{{ formatTime(hover.time) }}</span>
        <span>{{ formatBeat(hover.beat) }}</span>
    </div>

    <div
        class="absolute flex w-full -translate-y-1/2 justify-center"
        :style="{ top: `${hover.top}px` }"
    >
        <div class="flex justify-around" :style="{ width: `${width * 100}%` }">
            <span
                v-for="i in 8"
                :key="i"
                :class="8 - i === view.hoverLane ? 'text-white' : 'text-white/50'"
                >{{ 8 - i }}</span
            >
        </div>
    </div>
</template>
