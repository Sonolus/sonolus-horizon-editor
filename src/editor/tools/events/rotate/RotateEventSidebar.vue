<script setup lang="ts">
import { computed } from 'vue'
import {
    defaultRotateEventProperties,
    editSelectedRotateEvents,
    setDefaultRotateEventProperties,
    type DefaultRotateEventProperties,
} from '.'
import type { EventObject } from '../../../../chart'
import { selectedEntities } from '../../../../history/selectedEntities'
import { i18n } from '../../../../i18n'
import BeatField from '../../../../modals/form/BeatField.vue'
import LaneField from '../../../../modals/form/LaneField.vue'
import OptionalEaseField from '../../../../modals/form/OptionalEaseField.vue'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'

const createDefaultModel = <K extends keyof DefaultRotateEventProperties>(key: K) =>
    computed({
        get: () => defaultRotateEventProperties[key],
        set: (value) => {
            setDefaultRotateEventProperties({ ...defaultRotateEventProperties, [key]: value })
        },
    })

const defaultEase = createDefaultModel('ease')

const selectedRotateEvents = computed(() =>
    selectedEntities.value.filter((entity) => entity.type === 'rotateEventJoint'),
)

const createSelectedModel = <K extends keyof EventObject>(key: K) =>
    computed({
        get: () => {
            let value: EventObject[K] | undefined

            for (const entity of selectedRotateEvents.value) {
                if (value === undefined) {
                    value = entity[key]
                } else if (value !== entity[key]) {
                    return undefined
                }
            }

            return value
        },
        set: (value) => {
            editSelectedRotateEvents({ [key]: value })
        },
    })

const selectedBeat = createSelectedModel('beat')
const selectedValue = createSelectedModel('value')
const selectedEase = createSelectedModel('ease')
</script>

<template>
    <BaseSidebar
        v-if="selectedRotateEvents.length"
        :title="i18n.tools.events.sidebars.rotateEvent.title.selected"
    >
        <LaneField v-if="selectedRotateEvents.length === 1" v-model="selectedValue!" step="any" />
        <OptionalEaseField v-model="selectedEase" />
        <BeatField v-if="selectedRotateEvents.length === 1" v-model="selectedBeat!" />
    </BaseSidebar>
    <BaseSidebar v-else :title="i18n.tools.events.sidebars.rotateEvent.title.default">
        <OptionalEaseField v-model="defaultEase" />
    </BaseSidebar>
</template>
