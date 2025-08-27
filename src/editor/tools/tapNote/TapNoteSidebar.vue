<script setup lang="ts">
import { computed } from 'vue'
import {
    defaultTapNoteProperties,
    editSelectedTapNotes,
    setDefaultTapNoteProperties,
    type DefaultTapNoteProperties,
} from '.'
import type { TapNoteObject } from '../../../chart'
import { selectedEntities } from '../../../history/selectedEntities'
import { i18n } from '../../../i18n'
import BeatField from '../../../modals/form/BeatField.vue'
import LaneField from '../../../modals/form/LaneField.vue'
import OptionalColorField from '../../../modals/form/OptionalColorField.vue'
import BaseSidebar from '../../sidebars/BaseSidebar.vue'

const createDefaultModel = <K extends keyof DefaultTapNoteProperties>(key: K) =>
    computed({
        get: () => defaultTapNoteProperties[key],
        set: (value) => {
            setDefaultTapNoteProperties({ ...defaultTapNoteProperties, [key]: value })
        },
    })

const defaultColor = createDefaultModel('color')

const selectedTapNotes = computed(() =>
    selectedEntities.value.filter((entity) => entity.type === 'tapNote'),
)

const createSelectedModel = <K extends keyof TapNoteObject>(key: K) =>
    computed({
        get: () => {
            let value: TapNoteObject[K] | undefined

            for (const entity of selectedTapNotes.value) {
                if (value === undefined) {
                    value = entity[key]
                } else if (value !== entity[key]) {
                    return undefined
                }
            }

            return value
        },
        set: (value) => {
            editSelectedTapNotes({ [key]: value })
        },
    })

const selectedBeat = createSelectedModel('beat')
const selectedColor = createSelectedModel('color')
const selectedLane = createSelectedModel('lane')
</script>

<template>
    <BaseSidebar v-if="selectedTapNotes.length" :title="i18n.tools.tapNote.sidebar.title.selected">
        <OptionalColorField v-model="selectedColor" />
        <LaneField
            v-if="selectedTapNotes.length === 1"
            v-model="selectedLane!"
            :min="0"
            :max="7"
            :step="1"
        />
        <BeatField v-if="selectedTapNotes.length === 1" v-model="selectedBeat!" />
    </BaseSidebar>
    <BaseSidebar v-else :title="i18n.tools.tapNote.sidebar.title.default">
        <OptionalColorField v-model="defaultColor" />
    </BaseSidebar>
</template>
