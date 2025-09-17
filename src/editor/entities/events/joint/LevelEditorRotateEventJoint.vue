<script setup lang="ts">
import { bpms } from '../../../../history/bpms'
import {
    rotateEventValueToLane,
    type RotateEventJointEntity,
} from '../../../../state/entities/events/joints/rotate'
import { beatToTime } from '../../../../state/integrals/bpms'
import { ups } from '../../../view'

defineProps<RotateEventJointEntity>()
</script>

<template>
    <circle
        :cx="3.5 - rotateEventValueToLane(value)"
        :cy="beatToTime(bpms, beat) * ups"
        r="0.1"
        stroke="#fff"
        fill="#0f0"
    />
</template>
