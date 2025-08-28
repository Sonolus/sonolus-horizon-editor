<script setup lang="ts">
import { computed } from 'vue'
import {
    editSelectedEditableEntities,
    isEditableEntity,
    type EditableEntity,
    type EditableObject,
} from '.'
import { selectedEntities } from '../../../history/selectedEntities'
import { i18n } from '../../../i18n'
import OptionalBeatField from '../../../modals/form/OptionalBeatField.vue'
import OptionalBpmField from '../../../modals/form/OptionalBpmField.vue'
import OptionalColorField from '../../../modals/form/OptionalColorField.vue'
import OptionalEaseField from '../../../modals/form/OptionalEaseField.vue'
import OptionalLaneField from '../../../modals/form/OptionalLaneField.vue'
import OptionalLaneLField from '../../../modals/form/OptionalLaneLField.vue'
import OptionalLaneRField from '../../../modals/form/OptionalLaneRField.vue'
import OptionalRotateLaneField from '../../../modals/form/OptionalRotateLaneField.vue'
import OptionalScaleLField from '../../../modals/form/OptionalScaleLField.vue'
import OptionalScaleRField from '../../../modals/form/OptionalScaleRField.vue'
import OptionalTimeScaleField from '../../../modals/form/OptionalTimeScaleField.vue'
import OptionalValueField from '../../../modals/form/OptionalValueField.vue'
import BaseSidebar from '../BaseSidebar.vue'

const selectedEditableEntities = computed(() => selectedEntities.value.filter(isEditableEntity))

const isSingle = computed(() => selectedEditableEntities.value.length === 1)

const types = computed(() => {
    const types: Partial<Record<EditableEntity['type'], boolean>> = {}

    for (const entity of selectedEditableEntities.value) {
        types[entity.type] = true
    }

    return types
})

const createModel = <K extends keyof EditableObject>(key: K) =>
    computed({
        get: () => {
            let value: EditableObject[K] | undefined

            for (const entity of selectedEditableEntities.value) {
                const object: EditableObject = entity
                if (value === undefined) {
                    value = object[key]
                } else if (value !== object[key]) {
                    return undefined
                }
            }

            return value
        },
        set: (value) => {
            if (value === undefined) return

            editSelectedEditableEntities({ [key]: value })
        },
    })

const beat = createModel('beat')
const value = createModel('value')
const ease = createModel('ease')
const color = createModel('color')
const lane = createModel('lane')
const scaleL = createModel('scaleL')
const scaleR = createModel('scaleR')
const laneL = createModel('laneL')
const laneR = createModel('laneR')
</script>

<template>
    <BaseSidebar :title="i18n.sidebar.default.title">
        <div v-if="!selectedEditableEntities.length">{{ i18n.sidebar.default.none }}</div>
        <OptionalBpmField v-if="types.bpm" v-model="value" validate />
        <OptionalTimeScaleField v-if="types.timeScale" v-model="value" validate />
        <OptionalRotateLaneField
            v-if="isSingle && types.rotateEventJoint"
            v-model="value"
            validate
        />
        <OptionalValueField
            v-if="isSingle && (types.shiftEventJoint || types.zoomEventJoint)"
            v-model="value"
        />
        <OptionalEaseField
            v-if="types.rotateEventJoint || types.shiftEventJoint || types.zoomEventJoint"
            v-model="ease"
        />
        <OptionalColorField
            v-if="types.tapNote || types.singleHoldNoteJoint || types.doubleHoldNoteJoint"
            v-model="color"
        />
        <OptionalLaneField
            v-if="isSingle && (types.tapNote || types.singleHoldNoteJoint)"
            v-model="lane"
            validate
        />
        <OptionalLaneLField v-if="isSingle && types.doubleHoldNoteJoint" v-model="laneL" validate />
        <OptionalLaneRField v-if="isSingle && types.doubleHoldNoteJoint" v-model="laneR" validate />
        <OptionalBeatField v-if="isSingle" v-model="beat" validate />
        <OptionalScaleLField v-if="types.singleHoldNoteJoint" v-model="scaleL" validate />
        <OptionalScaleRField v-if="types.singleHoldNoteJoint" v-model="scaleR" validate />
    </BaseSidebar>
</template>
