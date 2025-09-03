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
import MultiBeatField from '../../../modals/form/MultiBeatField.vue'
import MultiBpmField from '../../../modals/form/MultiBpmField.vue'
import MultiColorField from '../../../modals/form/MultiColorField.vue'
import MultiEaseField from '../../../modals/form/MultiEaseField.vue'
import MultiLaneField from '../../../modals/form/MultiLaneField.vue'
import MultiLaneLField from '../../../modals/form/MultiLaneLField.vue'
import MultiLaneRField from '../../../modals/form/MultiLaneRField.vue'
import MultiRotateValueField from '../../../modals/form/MultiRotateValueField.vue'
import MultiScaleLField from '../../../modals/form/MultiScaleLField.vue'
import MultiScaleRField from '../../../modals/form/MultiScaleRField.vue'
import MultiTimeScaleField from '../../../modals/form/MultiTimeScaleField.vue'
import MultiValueField from '../../../modals/form/MultiValueField.vue'
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
        <MultiBpmField v-if="types.bpm" v-model="value" />
        <MultiTimeScaleField v-if="types.timeScale" v-model="value" />
        <MultiRotateValueField v-if="isSingle && types.rotateEventJoint" v-model="value" />
        <MultiValueField
            v-if="isSingle && (types.shiftEventJoint || types.zoomEventJoint)"
            v-model="value"
        />
        <MultiEaseField
            v-if="types.rotateEventJoint || types.shiftEventJoint || types.zoomEventJoint"
            v-model="ease"
        />
        <MultiColorField
            v-if="types.tapNote || types.singleHoldNoteJoint || types.doubleHoldNoteJoint"
            v-model="color"
        />
        <MultiLaneField
            v-if="isSingle && (types.tapNote || types.singleHoldNoteJoint)"
            v-model="lane"
        />
        <MultiLaneLField v-if="isSingle && types.doubleHoldNoteJoint" v-model="laneL" />
        <MultiLaneRField v-if="isSingle && types.doubleHoldNoteJoint" v-model="laneR" />
        <MultiBeatField v-if="isSingle" v-model="beat" />
        <MultiScaleLField v-if="types.singleHoldNoteJoint" v-model="scaleL" />
        <MultiScaleRField v-if="types.singleHoldNoteJoint" v-model="scaleR" />
    </BaseSidebar>
</template>
