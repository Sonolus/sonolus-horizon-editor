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
import OptionalBeatField from '../../../modals/form/OptionalBeatField.vue'
import OptionalColorField from '../../../modals/form/OptionalColorField.vue'
import OptionalLaneField from '../../../modals/form/OptionalLaneField.vue'
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

const isSingle = computed(() => selectedTapNotes.value.length === 1)

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
        <OptionalLaneField v-if="isSingle" v-model="selectedLane" />
        <OptionalBeatField v-if="isSingle" v-model="selectedBeat" />
    </BaseSidebar>
    <BaseSidebar v-else :title="i18n.tools.tapNote.sidebar.title.default">
        <OptionalColorField v-model="defaultColor" />
    </BaseSidebar>
</template>
