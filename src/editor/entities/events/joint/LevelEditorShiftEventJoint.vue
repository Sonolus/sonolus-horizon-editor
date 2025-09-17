<script setup lang="ts">
import { bpms } from '../../../../history/bpms'
import {
    shiftEventValueToLane,
    type ShiftEventJointEntity,
} from '../../../../state/entities/events/joints/shift'
import { beatToTime } from '../../../../state/integrals/bpms'
import { ups } from '../../../view'

defineProps<ShiftEventJointEntity>()
</script>

<template>
    <circle
        :cx="3.5 - shiftEventValueToLane(value)"
        :cy="beatToTime(bpms, beat) * ups"
        r="0.1"
        stroke="#fff"
        fill="#f00"
    />
</template>
