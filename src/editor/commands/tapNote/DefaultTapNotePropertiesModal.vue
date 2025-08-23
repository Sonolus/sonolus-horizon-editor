<script setup lang="ts">
import { shallowReactive } from 'vue'
import { i18n } from '../../../i18n'
import FormModal from '../../../modals/form/FormModal.vue'
import OptionalColorField from '../../../modals/form/OptionalColorField.vue'
import type { DefaultTapNoteProperties } from '../../tools/tapNote'

const props = defineProps<{
    properties: DefaultTapNoteProperties
}>()

defineEmits<{
    close: [properties?: DefaultTapNoteProperties]
}>()

const model = shallowReactive({ ...props.properties })
</script>

<template>
    <FormModal
        :title="i18n.commands.tapNote.modal.title"
        @close="$emit('close')"
        @submit="$emit('close', model)"
    >
        <OptionalColorField
            v-model="model.color"
            :label="i18n.commands.tapNote.modal.color"
            autofocus
        />
    </FormModal>
</template>
