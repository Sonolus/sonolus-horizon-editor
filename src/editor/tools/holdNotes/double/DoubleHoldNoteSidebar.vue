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
import OptionalBeatField from '../../../../modals/form/OptionalBeatField.vue'
import OptionalColorField from '../../../../modals/form/OptionalColorField.vue'
import OptionalLaneLField from '../../../../modals/form/OptionalLaneLField.vue'
import OptionalLaneRField from '../../../../modals/form/OptionalLaneRField.vue'
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

const isSingle = computed(() => selectedDoubleHoldNoteJoints.value.length === 1)

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
        <OptionalLaneLField v-if="isSingle" v-model="selectedLaneL" validate />
        <OptionalLaneRField v-if="isSingle" v-model="selectedLaneR" validate />
        <OptionalBeatField v-if="isSingle" v-model="selectedBeat" validate />
    </BaseSidebar>
    <BaseSidebar v-else :title="i18n.tools.holdNotes.sidebars.doubleHoldNote.title.default">
        <OptionalColorField v-model="defaultColor" />
        <OptionalSizeField v-model="defaultSize" validate />
    </BaseSidebar>
</template>
