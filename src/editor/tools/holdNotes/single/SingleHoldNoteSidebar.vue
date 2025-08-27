<script setup lang="ts">
import { computed } from 'vue'
import {
    defaultSingleHoldNoteProperties,
    editSelectedSingleHoldNoteJoints,
    setDefaultSingleHoldNoteProperties,
    type DefaultSingleHoldNoteProperties,
} from '.'
import type { SingleHoldNoteJointObject } from '../../../../chart'
import { selectedEntities } from '../../../../history/selectedEntities'
import { i18n } from '../../../../i18n'
import BeatField from '../../../../modals/form/BeatField.vue'
import LaneField from '../../../../modals/form/LaneField.vue'
import OptionalColorField from '../../../../modals/form/OptionalColorField.vue'
import OptionalScaleLField from '../../../../modals/form/OptionalScaleLField.vue'
import OptionalScaleRField from '../../../../modals/form/OptionalScaleRField.vue'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'

const createDefaultModel = <K extends keyof DefaultSingleHoldNoteProperties>(key: K) =>
    computed({
        get: () => defaultSingleHoldNoteProperties[key],
        set: (value) => {
            setDefaultSingleHoldNoteProperties({ ...defaultSingleHoldNoteProperties, [key]: value })
        },
    })

const defaultColor = createDefaultModel('color')
const defaultScaleL = createDefaultModel('scaleL')
const defaultScaleR = createDefaultModel('scaleR')

const selectedSingleHoldNoteJoints = computed(() =>
    selectedEntities.value.filter((entity) => entity.type === 'singleHoldNoteJoint'),
)

const createSelectedModel = <K extends keyof SingleHoldNoteJointObject>(key: K) =>
    computed({
        get: () => {
            let value: SingleHoldNoteJointObject[K] | undefined

            for (const entity of selectedSingleHoldNoteJoints.value) {
                if (value === undefined) {
                    value = entity[key]
                } else if (value !== entity[key]) {
                    return undefined
                }
            }

            return value
        },
        set: (value) => {
            editSelectedSingleHoldNoteJoints({ [key]: value })
        },
    })

const selectedBeat = createSelectedModel('beat')
const selectedColor = createSelectedModel('color')
const selectedLane = createSelectedModel('lane')
const selectedScaleL = createSelectedModel('scaleL')
const selectedScaleR = createSelectedModel('scaleR')
</script>

<template>
    <BaseSidebar
        v-if="selectedSingleHoldNoteJoints.length"
        :title="i18n.tools.holdNotes.sidebars.singleHoldNote.title.selected"
    >
        <OptionalColorField v-model="selectedColor" />
        <LaneField
            v-if="selectedSingleHoldNoteJoints.length === 1"
            v-model="selectedLane!"
            :min="0"
            :max="7"
            :step="1"
        />
        <BeatField v-if="selectedSingleHoldNoteJoints.length === 1" v-model="selectedBeat!" />
        <OptionalScaleLField v-model="selectedScaleL" />
        <OptionalScaleRField v-model="selectedScaleR" />
    </BaseSidebar>
    <BaseSidebar v-else :title="i18n.tools.holdNotes.sidebars.singleHoldNote.title.default">
        <OptionalColorField v-model="defaultColor" />
        <OptionalScaleLField v-model="defaultScaleL" />
        <OptionalScaleRField v-model="defaultScaleR" />
    </BaseSidebar>
</template>
