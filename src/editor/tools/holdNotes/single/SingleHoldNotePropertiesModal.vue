<script setup lang="ts">
import { shallowReactive } from 'vue'
import type { SingleHoldNoteJointObject } from '../../../../chart'
import { i18n } from '../../../../i18n'
import BeatField from '../../../../modals/form/BeatField.vue'
import ColorField from '../../../../modals/form/ColorField.vue'
import FormModal from '../../../../modals/form/FormModal.vue'
import LaneField from '../../../../modals/form/LaneField.vue'
import ScaleLField from '../../../../modals/form/ScaleLField.vue'
import ScaleRField from '../../../../modals/form/ScaleRField.vue'

const props = defineProps<{
    object: SingleHoldNoteJointObject
}>()

defineEmits<{
    close: [object?: SingleHoldNoteJointObject]
}>()

const model = shallowReactive({ ...props.object })
</script>

<template>
    <FormModal
        :title="i18n.tools.holdNotes.modals.singleHoldNote.title"
        @close="$emit('close')"
        @submit="$emit('close', model)"
    >
        <ColorField v-model="model.color" />
        <LaneField v-model="model.lane" />
        <BeatField v-model="model.beat" />
        <ScaleLField v-model="model.scaleL" />
        <ScaleRField v-model="model.scaleR" />
    </FormModal>
</template>
