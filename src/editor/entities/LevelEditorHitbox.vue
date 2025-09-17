<script setup lang="ts">
import { bpms } from '../../history/bpms'
import type { EntityHitbox } from '../../state/entities'
import { beatToTime } from '../../state/integrals/bpms'
import { viewBox } from '../view'

defineProps<{
    hitbox: EntityHitbox
}>()
</script>

<template>
    <rect
        :x="3.5 - hitbox.lane - hitbox.w - 0.1"
        :y="beatToTime(bpms, hitbox.beat) * viewBox.ups - hitbox.t - 0.1"
        :width="hitbox.w * 2 + 0.2"
        :height="hitbox.t + hitbox.b + 0.2"
        stroke="#fff"
        stroke-dasharray="6 4"
    />
</template>
