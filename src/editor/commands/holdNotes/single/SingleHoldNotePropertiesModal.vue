<script setup lang="ts">
import { reactive } from 'vue'
import { i18n } from '../../../../i18n'
import ColorField from '../../../../modals/form/ColorField.vue'
import FormModal from '../../../../modals/form/FormModal.vue'
import NumberField from '../../../../modals/form/NumberField.vue'
import ToggleField from '../../../../modals/form/ToggleField.vue'
import type { SingleHoldNoteProperties } from '../../../tools/holdNotes/single'

const props = defineProps<{
    singleHoldNoteProperties: SingleHoldNoteProperties
}>()

const emit = defineEmits<{
    close: [properties?: SingleHoldNoteProperties]
}>()

const model = reactive({
    color: {
        isEnabled: props.singleHoldNoteProperties.color !== undefined,
        value: props.singleHoldNoteProperties.color ?? 0,
    },
    scaleL: {
        isEnabled: props.singleHoldNoteProperties.scaleL !== undefined,
        value: props.singleHoldNoteProperties.scaleL ?? 0,
    },
    scaleR: {
        isEnabled: props.singleHoldNoteProperties.scaleR !== undefined,
        value: props.singleHoldNoteProperties.scaleR ?? 0,
    },
})

const onSubmit = () => {
    emit('close', {
        color: model.color.isEnabled ? model.color.value : undefined,
        scaleL: model.scaleL.isEnabled ? model.scaleL.value : undefined,
        scaleR: model.scaleR.isEnabled ? model.scaleR.value : undefined,
    })
}
</script>

<template>
    <FormModal
        :title="i18n.commands.singleHoldNote.modal.title"
        @close="$emit('close')"
        @submit="onSubmit"
    >
        <ToggleField
            v-model="model.color.isEnabled"
            :label="i18n.commands.singleHoldNote.modal.color"
            autofocus
        />
        <ColorField
            v-if="model.color.isEnabled"
            v-model="model.color.value"
            :label="i18n.commands.singleHoldNote.modal.color"
        />

        <ToggleField
            v-model="model.scaleL.isEnabled"
            :label="i18n.commands.singleHoldNote.modal.scaleL"
        />
        <NumberField
            v-if="model.scaleL.isEnabled"
            v-model="model.scaleL.value"
            :label="i18n.commands.singleHoldNote.modal.scaleL"
            :min="0"
            :max="1"
            step="any"
        />

        <ToggleField
            v-model="model.scaleR.isEnabled"
            :label="i18n.commands.singleHoldNote.modal.scaleR"
        />
        <NumberField
            v-if="model.scaleR.isEnabled"
            v-model="model.scaleR.value"
            :label="i18n.commands.singleHoldNote.modal.scaleR"
            :min="0"
            :max="1"
            step="any"
        />
    </FormModal>
</template>
