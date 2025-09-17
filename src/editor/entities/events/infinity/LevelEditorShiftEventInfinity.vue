<script setup lang="ts">
import { computed } from 'vue'
import { bpms } from '../../../../history/bpms'
import { store } from '../../../../history/store'
import { shiftEventValueToLane } from '../../../../state/entities/events/joints/shift'
import { beatToTime } from '../../../../state/integrals/bpms'
import { ups, viewBox } from '../../../view'

const range = computed(() => store.value.eventRanges.shiftEventJoint)
</script>

<template>
    <g stroke="#f00" stroke-opacity="0.5">
        <template v-if="range">
            <line
                :x1="3.5 - shiftEventValueToLane(range.min.value)"
                :x2="3.5 - shiftEventValueToLane(range.min.value)"
                :y1="0"
                :y2="beatToTime(bpms, range.min.beat) * ups"
            />
            <line
                :x1="3.5 - shiftEventValueToLane(range.max.value)"
                :x2="3.5 - shiftEventValueToLane(range.max.value)"
                :y1="beatToTime(bpms, range.max.beat) * ups"
                :y2="viewBox.t"
            />
        </template>
        <line
            v-else
            :x1="3.5 - shiftEventValueToLane(0)"
            :x2="3.5 - shiftEventValueToLane(0)"
            :y1="0"
            :y2="viewBox.t"
        />
    </g>
</template>
