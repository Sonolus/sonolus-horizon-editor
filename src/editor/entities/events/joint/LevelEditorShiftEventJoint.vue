<script setup lang="ts">
import { computed } from 'vue'
import { bpms } from '../../../../history/bpms'
import {
    shiftEventValueToLane,
    type ShiftEventJointEntity,
} from '../../../../state/entities/events/joints/shift'
import { beatToTime } from '../../../../state/integrals/bpms'
import { ups } from '../../../view'

const props = defineProps<ShiftEventJointEntity>()

const time = computed(() => beatToTime(bpms.value, props.beat))
</script>

<template>
    <circle
        :cx="3.5 - shiftEventValueToLane(value)"
        :cy="time * ups"
        r="0.1"
        stroke="#fff"
        fill="#f00"
    />
</template>
