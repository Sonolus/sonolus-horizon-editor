<script setup lang="ts">
import { reactive } from 'vue'
import { i18n } from '../../../../i18n'
import ColorField from '../../../../modals/form/ColorField.vue'
import FormModal from '../../../../modals/form/FormModal.vue'
import NumberField from '../../../../modals/form/NumberField.vue'
import ToggleField from '../../../../modals/form/ToggleField.vue'
import type { DoubleHoldNoteProperties } from '../../../tools/holdNotes/double'

const props = defineProps<{
    doubleHoldNoteProperties: DoubleHoldNoteProperties
}>()

const emit = defineEmits<{
    close: [properties?: DoubleHoldNoteProperties]
}>()

const model = reactive({
    color: {
        isEnabled: props.doubleHoldNoteProperties.color !== undefined,
        value: props.doubleHoldNoteProperties.color ?? 0,
    },
    size: {
        isEnabled: props.doubleHoldNoteProperties.size !== undefined,
        value: props.doubleHoldNoteProperties.size ?? 0,
    },
})

const onSubmit = () => {
    emit('close', {
        color: model.color.isEnabled ? model.color.value : undefined,
        size: model.size.isEnabled ? model.size.value : undefined,
    })
}
</script>

<template>
    <FormModal
        :title="i18n.commands.doubleHoldNote.modal.title"
        @close="$emit('close')"
        @submit="onSubmit"
    >
        <ToggleField
            v-model="model.color.isEnabled"
            :label="i18n.commands.doubleHoldNote.modal.color"
            autofocus
        />
        <ColorField
            v-if="model.color.isEnabled"
            v-model="model.color.value"
            :label="i18n.commands.doubleHoldNote.modal.color"
        />

        <ToggleField
            v-model="model.size.isEnabled"
            :label="i18n.commands.doubleHoldNote.modal.size"
        />
        <NumberField
            v-if="model.size.isEnabled"
            v-model="model.size.value"
            :label="i18n.commands.doubleHoldNote.modal.size"
            :min="0"
            :max="7"
            :step="1"
        />
    </FormModal>
</template>
