<script setup lang="ts">
import { computed } from 'vue'
import { bpms } from '../../../history/bpms'
import type { BpmEntity } from '../../../state/entities/values/bpm'
import { beatToTime } from '../../../state/integrals/bpms'
import { formatBpm } from '../../../utils/format'
import { ups } from '../../view'

const props = defineProps<BpmEntity>()

const y = computed(() => beatToTime(bpms.value, props.beat) * ups.value)
</script>

<template>
    <g>
        <line :x1="-4" :x2="4" :y1="y" :y2="y" stroke="#f0f" stroke-opacity="0.5" />

        <text :x="4.1" :y text-anchor="start" dominant-baseline="middle" fill="#f0f">
            {{ formatBpm(value) }}
        </text>
    </g>
</template>
