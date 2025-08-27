<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import LevelEditor from './editor/LevelEditor.vue'
import ModalManager from './modals/ModalManager.vue'
import LevelPreview from './preview/LevelPreview.vue'
import { screenSm } from './screen'
import { settings } from './settings'

watch(
    () => settings.locale,
    () => {
        document.documentElement.lang = settings.locale
    },
    { immediate: true },
)

const previewPosition = computed(() =>
    settings.previewPosition !== 'auto'
        ? settings.previewPosition
        : screenSm.value
          ? 'left'
          : 'top',
)

const isDragging = ref(false)
const wasDragging = ref(false)

const onStartDragging = () => {
    isDragging.value = true
    wasDragging.value = false
}

const onDrag = (event: PointerEvent) => {
    if (!isDragging.value) return
    wasDragging.value = true

    settings.showPreview = true
    if (previewPosition.value === 'left') {
        settings.previewWidth = event.clientX
    } else {
        settings.previewHeight = event.clientY
    }
}

const onStopDragging = () => {
    isDragging.value = false
}

const onToggle = () => {
    if (wasDragging.value) return

    settings.showPreview = !settings.showPreview
}

const onFocus = (event: FocusEvent) => {
    ;(event.currentTarget as HTMLElement | null)?.blur()
}
</script>

<template>
    <div
        class="flex h-screen w-screen overflow-hidden"
        :class="previewPosition === 'left' ? 'flex-row-reverse' : 'flex-col-reverse'"
        @pointermove="onDrag"
        @pointerup="onStopDragging"
    >
        <div class="flex-grow">
            <LevelEditor />
        </div>

        <div
            class="relative bg-[#111]"
            :class="
                previewPosition === 'left'
                    ? { 'min-w-[25%] max-w-[75%]': settings.showPreview }
                    : { 'max-h-[75%] min-h-[25%]': settings.showPreview }
            "
            :style="
                previewPosition === 'left'
                    ? { width: (settings.showPreview ? settings.previewWidth : 0) + 'px' }
                    : { height: (settings.showPreview ? settings.previewHeight : 0) + 'px' }
            "
        >
            <LevelPreview v-if="settings.showPreview" />

            <button
                class="absolute flex items-center justify-center bg-[#222] transition-colors hover:bg-[#444] active:bg-[#111]"
                :class="
                    previewPosition === 'left'
                        ? 'left-full top-1/2 h-16 w-4 -translate-y-1/2 cursor-col-resize'
                        : 'left-1/2 top-full h-4 w-16 -translate-x-1/2 cursor-row-resize'
                "
                @click="onToggle"
                @pointerdown="onStartDragging"
                @focus="onFocus"
            >
                <svg
                    v-if="previewPosition === 'left'"
                    class="size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 192 512"
                >
                    <!--! Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. -->
                    <path
                        d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64L0 448c0 17.7 14.3 32 32 32s32-14.3 32-32L64 64zm128 0c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 384c0 17.7 14.3 32 32 32s32-14.3 32-32l0-384z"
                    />
                </svg>
                <svg v-else class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <!--! Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. -->
                    <path
                        d="M32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 288zm0-128c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z"
                    />
                </svg>
            </button>
        </div>
    </div>

    <ModalManager />
</template>
