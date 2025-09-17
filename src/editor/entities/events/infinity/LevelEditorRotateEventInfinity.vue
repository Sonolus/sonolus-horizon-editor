<script setup lang="ts">
import { computed } from 'vue'
import { bpms } from '../../../../history/bpms'
import { store } from '../../../../history/store'
import { rotateEventValueToLane } from '../../../../state/entities/events/joints/rotate'
import { beatToTime } from '../../../../state/integrals/bpms'
import { ups, viewBox } from '../../../view'

const range = computed(() => store.value.eventRanges.rotateEventJoint)
</script>

<template>
    <g stroke="#0f0" stroke-opacity="0.5">
        <template v-if="range">
            <line
                :x1="3.5 - rotateEventValueToLane(range.min.value)"
                :x2="3.5 - rotateEventValueToLane(range.min.value)"
                :y1="0"
                :y2="beatToTime(bpms, range.min.beat) * ups"
            />
            <line
                :x1="3.5 - rotateEventValueToLane(range.max.value)"
                :x2="3.5 - rotateEventValueToLane(range.max.value)"
                :y1="beatToTime(bpms, range.max.beat) * ups"
                :y2="viewBox.t"
            />
        </template>
        <line
            v-else
            :x1="3.5 - rotateEventValueToLane(0)"
            :x2="3.5 - rotateEventValueToLane(0)"
            :y1="0"
            :y2="viewBox.t"
        />
    </g>
</template>
