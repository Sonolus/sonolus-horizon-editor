<script setup lang="ts">
import LevelEditorHitbox from './entities/LevelEditorHitbox.vue'
import { view } from './view'
</script>

<template>
    <template v-for="entity in view.entities.hovered" :key="entity">
        <LevelEditorHitbox v-if="entity.hitbox" :hitbox="entity.hitbox" stroke-opacity="0.5" />
    </template>
</template>
