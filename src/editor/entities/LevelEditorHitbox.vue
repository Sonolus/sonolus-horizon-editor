<script setup lang="ts">
import { computed } from 'vue'
import { bpms } from '../../history/bpms'
import type { EntityHitbox } from '../../state/entities'
import { beatToTime } from '../../state/integrals/bpms'
import { ups } from '../view'

const props = defineProps<{
    hitbox: EntityHitbox
}>()

const time = computed(() => beatToTime(bpms.value, props.hitbox.beat))
</script>

<template>
    <rect
        :x="3.5 - hitbox.lane - hitbox.w - 0.1"
        :y="time * ups - hitbox.t - 0.1"
        :width="hitbox.w * 2 + 0.2"
        :height="hitbox.t + hitbox.b + 0.2"
        stroke="#fff"
        stroke-dasharray="6 4"
    />
</template>
