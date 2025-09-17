<script setup lang="ts">
import { computed } from 'vue'
import { bpms } from '../../../../history/bpms'
import {
    rotateEventValueToLane,
    type RotateEventJointEntity,
} from '../../../../state/entities/events/joints/rotate'
import { beatToTime } from '../../../../state/integrals/bpms'
import { ups } from '../../../view'

const props = defineProps<RotateEventJointEntity>()

const time = computed(() => beatToTime(bpms.value, props.beat))
</script>

<template>
    <circle
        :cx="3.5 - rotateEventValueToLane(value)"
        :cy="time * ups"
        r="0.1"
        stroke="#fff"
        fill="#0f0"
    />
</template>
