<script setup lang="ts">
import { i18n } from '../../i18n'
import NumberField from '../../modals/form/NumberField.vue'
import SelectField from '../../modals/form/SelectField.vue'
import { settings } from '../../settings'
import SettingsSection from './SettingsSection.vue'
</script>

<template>
    <SettingsSection :title="i18n.settings.preview.title">
        <SelectField
            v-model="settings.previewPosition"
            :label="i18n.settings.preview.position.title"
            :options="[
                [i18n.settings.preview.position.auto, 'auto'],
                [i18n.settings.preview.position.top, 'top'],
                [i18n.settings.preview.position.left, 'left'],
            ]"
        />

        <NumberField
            v-model="settings.previewNoteSpeed"
            :label="i18n.settings.preview.noteSpeed"
            :min="1"
            :max="15"
            :step="0.1"
        />

        <NumberField
            v-model="settings.previewConnectionAlpha"
            :label="i18n.settings.preview.connectorAlpha"
            :min="10"
            :max="100"
            :step="5"
        />
    </SettingsSection>
</template>
