<script setup lang="ts">
import { shallowReactive } from 'vue'
import type { DoubleHoldNoteJointObject } from '../../../../chart'
import { i18n } from '../../../../i18n'
import BeatField from '../../../../modals/form/BeatField.vue'
import ColorField from '../../../../modals/form/ColorField.vue'
import FormModal from '../../../../modals/form/FormModal.vue'
import LaneLField from '../../../../modals/form/LaneLField.vue'
import LaneRField from '../../../../modals/form/LaneRField.vue'

const props = defineProps<{
    object: DoubleHoldNoteJointObject
}>()

defineEmits<{
    close: [object?: DoubleHoldNoteJointObject]
}>()

const model = shallowReactive({ ...props.object })
</script>

<template>
    <FormModal
        :title="i18n.tools.holdNotes.modals.doubleHoldNote.title"
        @close="$emit('close')"
        @submit="$emit('close', model)"
    >
        <ColorField v-model="model.color" />
        <LaneLField v-model="model.laneL" />
        <LaneRField v-model="model.laneR" />
        <BeatField v-model="model.beat" />
    </FormModal>
</template>
