<script setup lang="ts">
defineProps<{
    title: string
}>()

defineEmits<{
    close: []
}>()
</script>

<template>
    <div class="flex items-center justify-between bg-[#222] p-4 text-lg font-bold">
        <span>{{ title }}</span>
        <button class="size-8 p-1" @click="$emit('close')">
            <svg class="size-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <!--! Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. -->
                <path
                    d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                />
            </svg>
        </button>
    </div>

    <div class="flex flex-col gap-4 overflow-y-auto p-4">
        <slot />
    </div>
</template>
