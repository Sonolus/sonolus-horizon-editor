<script setup lang="ts">
import { computed } from 'vue'
import {
    defaultDoubleHoldNoteProperties,
    editSelectedDoubleHoldNoteJoints,
    setDefaultDoubleHoldNoteProperties,
    type DefaultDoubleHoldNoteProperties,
} from '.'
import type { DoubleHoldNoteJointObject } from '../../../../chart'
import { selectedEntities } from '../../../../history/selectedEntities'
import { i18n } from '../../../../i18n'
import BeatField from '../../../../modals/form/BeatField.vue'
import LaneLField from '../../../../modals/form/LaneLField.vue'
import LaneRField from '../../../../modals/form/LaneRField.vue'
import OptionalColorField from '../../../../modals/form/OptionalColorField.vue'
import OptionalSizeField from '../../../../modals/form/OptionalSizeField.vue'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'

const createDefaultModel = <K extends keyof DefaultDoubleHoldNoteProperties>(key: K) =>
    computed({
        get: () => defaultDoubleHoldNoteProperties[key],
        set: (value) => {
            setDefaultDoubleHoldNoteProperties({ ...defaultDoubleHoldNoteProperties, [key]: value })
        },
    })

const defaultColor = createDefaultModel('color')
const defaultSize = createDefaultModel('size')

const selectedDoubleHoldNoteJoints = computed(() =>
    selectedEntities.value.filter((entity) => entity.type === 'doubleHoldNoteJoint'),
)

const createSelectedModel = <K extends keyof DoubleHoldNoteJointObject>(key: K) =>
    computed({
        get: () => {
            let value: DoubleHoldNoteJointObject[K] | undefined

            for (const entity of selectedDoubleHoldNoteJoints.value) {
                if (value === undefined) {
                    value = entity[key]
                } else if (value !== entity[key]) {
                    return undefined
                }
            }

            return value
        },
        set: (value) => {
            editSelectedDoubleHoldNoteJoints({ [key]: value })
        },
    })

const selectedBeat = createSelectedModel('beat')
const selectedColor = createSelectedModel('color')
const selectedLaneL = createSelectedModel('laneL')
const selectedLaneR = createSelectedModel('laneR')
</script>

<template>
    <BaseSidebar
        v-if="selectedDoubleHoldNoteJoints.length"
        :title="i18n.tools.holdNotes.sidebars.doubleHoldNote.title.selected"
    >
        <OptionalColorField v-model="selectedColor" />
        <LaneLField v-if="selectedDoubleHoldNoteJoints.length === 1" v-model="selectedLaneL!" />
        <LaneRField v-if="selectedDoubleHoldNoteJoints.length === 1" v-model="selectedLaneR!" />
        <BeatField v-if="selectedDoubleHoldNoteJoints.length === 1" v-model="selectedBeat!" />
    </BaseSidebar>
    <BaseSidebar v-else :title="i18n.tools.holdNotes.sidebars.doubleHoldNote.title.default">
        <OptionalColorField v-model="defaultColor" />
        <OptionalSizeField v-model="defaultSize" />
    </BaseSidebar>
</template>
