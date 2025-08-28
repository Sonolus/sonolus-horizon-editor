<script setup lang="ts">
import { computed } from 'vue'
import {
    defaultZoomEventProperties,
    editSelectedZoomEvents,
    setDefaultZoomEventProperties,
    type DefaultZoomEventProperties,
} from '.'
import type { EventObject } from '../../../../chart'
import { selectedEntities } from '../../../../history/selectedEntities'
import { i18n } from '../../../../i18n'
import OptionalEaseField from '../../../../modals/form/OptionalEaseField.vue'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'

import OptionalBeatField from '../../../../modals/form/OptionalBeatField.vue'
import OptionalValueField from '../../../../modals/form/OptionalValueField.vue'
const createDefaultModel = <K extends keyof DefaultZoomEventProperties>(key: K) =>
    computed({
        get: () => defaultZoomEventProperties[key],
        set: (value) => {
            setDefaultZoomEventProperties({ ...defaultZoomEventProperties, [key]: value })
        },
    })

const defaultEase = createDefaultModel('ease')

const selectedZoomEvents = computed(() =>
    selectedEntities.value.filter((entity) => entity.type === 'zoomEventJoint'),
)

const isSingle = computed(() => selectedZoomEvents.value.length === 1)

const createSelectedModel = <K extends keyof EventObject>(key: K) =>
    computed({
        get: () => {
            let value: EventObject[K] | undefined

            for (const entity of selectedZoomEvents.value) {
                if (value === undefined) {
                    value = entity[key]
                } else if (value !== entity[key]) {
                    return undefined
                }
            }

            return value
        },
        set: (value) => {
            editSelectedZoomEvents({ [key]: value })
        },
    })

const selectedBeat = createSelectedModel('beat')
const selectedValue = createSelectedModel('value')
const selectedEase = createSelectedModel('ease')
</script>

<template>
    <BaseSidebar
        v-if="selectedZoomEvents.length"
        :title="i18n.tools.events.sidebars.zoomEvent.title.selected"
    >
        <OptionalValueField v-if="isSingle" v-model="selectedValue" />
        <OptionalEaseField v-model="selectedEase" />
        <OptionalBeatField v-if="isSingle" v-model="selectedBeat" />
    </BaseSidebar>
    <BaseSidebar v-else :title="i18n.tools.events.sidebars.zoomEvent.title.default">
        <OptionalEaseField v-model="defaultEase" />
    </BaseSidebar>
</template>
