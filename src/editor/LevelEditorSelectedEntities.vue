<script setup lang="ts">
import { selectedEntities } from '../history/selectedEntities'
import LevelEditorHitbox from './entities/LevelEditorHitbox.vue'
</script>

<template>
    <template v-for="entity in selectedEntities" :key="entity.hitbox">
        <LevelEditorHitbox v-if="entity.hitbox" :hitbox="entity.hitbox" />
    </template>
</template>
