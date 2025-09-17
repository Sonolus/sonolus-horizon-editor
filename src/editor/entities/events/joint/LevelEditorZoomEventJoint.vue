<script setup lang="ts">
import { bpms } from '../../../../history/bpms'
import {
    zoomEventValueToLane,
    type ZoomEventJointEntity,
} from '../../../../state/entities/events/joints/zoom'
import { beatToTime } from '../../../../state/integrals/bpms'
import { ups } from '../../../view'

defineProps<ZoomEventJointEntity>()
</script>

<template>
    <circle
        :cx="3.5 - zoomEventValueToLane(value)"
        :cy="beatToTime(bpms, beat) * ups"
        r="0.1"
        stroke="#fff"
        fill="#00f"
    />
</template>
