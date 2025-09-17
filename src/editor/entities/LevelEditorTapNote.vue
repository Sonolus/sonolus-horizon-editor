<script setup lang="ts">
import { colors } from '../../colors'
import { bpms } from '../../history/bpms'
import type { TapNoteEntity } from '../../state/entities/tapNote'
import { beatToTime } from '../../state/integrals/bpms'
import { ups } from '../view'

defineProps<TapNoteEntity>()
</script>

<template>
    <rect
        :x="3 - lane"
        :y="beatToTime(bpms, beat) * ups - 0.25"
        width="1"
        height="0.5"
        class="scale-stroke"
        stroke-width="0.05"
        stroke="#fff"
        :fill="colors[color]"
    />
</template>
