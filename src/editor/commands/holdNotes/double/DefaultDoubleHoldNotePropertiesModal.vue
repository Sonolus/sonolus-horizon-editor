<script setup lang="ts">
import { shallowReactive } from 'vue'
import { i18n } from '../../../../i18n'
import FormModal from '../../../../modals/form/FormModal.vue'
import OptionalColorField from '../../../../modals/form/OptionalColorField.vue'
import OptionalNumberField from '../../../../modals/form/OptionalNumberField.vue'
import type { DefaultDoubleHoldNoteProperties } from '../../../tools/holdNotes/double'

const props = defineProps<{
    properties: DefaultDoubleHoldNoteProperties
}>()

defineEmits<{
    close: [properties?: DefaultDoubleHoldNoteProperties]
}>()

const model = shallowReactive({ ...props.properties })
</script>

<template>
    <FormModal
        :title="i18n.commands.doubleHoldNote.modal.title"
        @close="$emit('close')"
        @submit="$emit('close', model)"
    >
        <OptionalColorField
            v-model="model.color"
            :label="i18n.commands.doubleHoldNote.modal.color"
            autofocus
        />
        <OptionalNumberField
            v-model="model.size"
            :label="i18n.commands.doubleHoldNote.modal.size"
            :default-value="1"
            :min="0"
            :max="7"
            :step="1"
        />
    </FormModal>
</template>
