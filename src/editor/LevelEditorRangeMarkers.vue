<script setup lang="ts">
import { computed } from 'vue'
import { beats, times } from '.'
import { formatBeat, formatTime } from '../utils/format'
import { viewBox } from './view'

const width = computed(() => 8 / viewBox.value.w)
</script>

<template>
    <div class="absolute flex size-full flex-col justify-between text-white/50">
        <div class="flex justify-between">
            <span>{{ formatTime(times.max) }}</span>
            <span>{{ formatBeat(beats.max) }}</span>
        </div>
        <div class="flex justify-between">
            <span>{{ formatTime(times.min) }}</span>
            <span>{{ formatBeat(beats.min) }}</span>
        </div>
    </div>

    <div class="absolute flex size-full justify-center text-white/50">
        <div class="flex h-full flex-col justify-between" :style="{ width: `${width * 100}%` }">
            <div class="flex justify-around">
                <span v-for="i in 8" :key="i">{{ 8 - i }}</span>
            </div>
            <div class="flex justify-around">
                <span v-for="i in 8" :key="i">{{ 8 - i }}</span>
            </div>
        </div>
    </div>
</template>
