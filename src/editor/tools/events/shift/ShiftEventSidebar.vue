<script setup lang="ts">
import { computed } from 'vue'
import {
    defaultShiftEventProperties,
    editSelectedShiftEvents,
    setDefaultShiftEventProperties,
    type DefaultShiftEventProperties,
} from '.'
import type { EventObject } from '../../../../chart'
import { selectedEntities } from '../../../../history/selectedEntities'
import { i18n } from '../../../../i18n'
import BeatField from '../../../../modals/form/BeatField.vue'
import OptionalEaseField from '../../../../modals/form/OptionalEaseField.vue'
import ValueField from '../../../../modals/form/ValueField.vue'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'

const createDefaultModel = <K extends keyof DefaultShiftEventProperties>(key: K) =>
    computed({
        get: () => defaultShiftEventProperties[key],
        set: (value) => {
            setDefaultShiftEventProperties({ ...defaultShiftEventProperties, [key]: value })
        },
    })

const defaultEase = createDefaultModel('ease')

const selectedShiftEvents = computed(() =>
    selectedEntities.value.filter((entity) => entity.type === 'shiftEventJoint'),
)

const createSelectedModel = <K extends keyof EventObject>(key: K) =>
    computed({
        get: () => {
            let value: EventObject[K] | undefined

            for (const entity of selectedShiftEvents.value) {
                if (value === undefined) {
                    value = entity[key]
                } else if (value !== entity[key]) {
                    return undefined
                }
            }

            return value
        },
        set: (value) => {
            editSelectedShiftEvents({ [key]: value })
        },
    })

const selectedBeat = createSelectedModel('beat')
const selectedValue = createSelectedModel('value')
const selectedEase = createSelectedModel('ease')
</script>

<template>
    <BaseSidebar
        v-if="selectedShiftEvents.length"
        :title="i18n.tools.events.sidebars.shiftEvent.title.selected"
    >
        <ValueField v-if="selectedShiftEvents.length === 1" v-model="selectedValue!" />
        <OptionalEaseField v-model="selectedEase" />
        <BeatField v-if="selectedShiftEvents.length === 1" v-model="selectedBeat!" />
    </BaseSidebar>
    <BaseSidebar v-else :title="i18n.tools.events.sidebars.shiftEvent.title.default">
        <OptionalEaseField v-model="defaultEase" />
    </BaseSidebar>
</template>
