<script setup lang="ts">
import { computed } from 'vue'
import { bpms } from '../../../../history/bpms'
import {
    zoomEventValueToLane,
    type ZoomEventJointEntity,
} from '../../../../state/entities/events/joints/zoom'
import { beatToTime } from '../../../../state/integrals/bpms'
import { ups } from '../../../view'

const props = defineProps<ZoomEventJointEntity>()

const time = computed(() => beatToTime(bpms.value, props.beat))
</script>

<template>
    <circle
        :cx="3.5 - zoomEventValueToLane(value)"
        :cy="time * ups"
        r="0.1"
        stroke="#fff"
        fill="#00f"
    />
</template>
