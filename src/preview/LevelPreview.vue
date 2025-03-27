<script setup lang="ts">
import { computed, ref, useTemplateRef, watch, type Ref } from 'vue'
import { time } from '../time'
import { zoom } from './events'
import LevelPreviewHoldNotes from './holdNotes/LevelPreviewHoldNotes.vue'
import LevelPreviewStage from './LevelPreviewStage.vue'
import LevelPreviewTapNotes from './LevelPreviewTapNotes.vue'
import { getTransform } from './projection'

const minAspectRatio = 4 / 3

const container: Ref<Element | null> = useTemplateRef('container')

const aspectRatio = ref(minAspectRatio)

watch(time, () => {
    if (!container.value) return

    const rect = container.value.getBoundingClientRect()
    aspectRatio.value = Math.max(minAspectRatio, rect.width / rect.height)
})

const transform = computed(() => `scale(1, -1) ${getTransform(zoom.value)}`)
</script>

<template>
    <svg
        ref="container"
        class="size-full"
        :viewBox="`${-aspectRatio} -1 ${aspectRatio * 2} 2`"
        font-size="0.15"
        stroke="none"
        stroke-width="0.01"
        fill="none"
    >
        <g mask="url(#screen)">
            <mask id="screen">
                <rect x="-5" y="-5" width="10" height="10" fill="#fff" fill-opacity="0.25" />
                <rect
                    :x="-minAspectRatio"
                    y="-1"
                    :width="minAspectRatio * 2"
                    height="2"
                    fill="#fff"
                />
            </mask>

            <g :transform>
                <LevelPreviewStage />
                <LevelPreviewTapNotes />
                <LevelPreviewHoldNotes />
            </g>
        </g>

        <rect
            :x="-minAspectRatio"
            y="-1"
            :width="minAspectRatio * 2"
            height="2"
            stroke="#fff"
            stroke-opacity="0.55"
        />
    </svg>
</template>
