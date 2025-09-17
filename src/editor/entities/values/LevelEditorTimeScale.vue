<script setup lang="ts">
import { computed } from 'vue'
import { bpms } from '../../../history/bpms'
import type { TimeScaleEntity } from '../../../state/entities/values/timeScale'
import { beatToTime } from '../../../state/integrals/bpms'
import { formatTimeScale } from '../../../utils/format'
import { ups } from '../../view'

const props = defineProps<TimeScaleEntity>()

const y = computed(() => beatToTime(bpms.value, props.beat) * ups.value)
</script>

<template>
    <g>
        <line :x1="-4" :x2="4" :y1="y" :y2="y" stroke="#ff0" stroke-opacity="0.5" />

        <text :x="-4.1" :y text-anchor="end" dominant-baseline="middle" fill="#ff0">
            {{ formatTimeScale(value) }}
        </text>
    </g>
</template>
