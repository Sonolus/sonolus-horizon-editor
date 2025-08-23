<script setup lang="ts">
import { reactive } from 'vue'
import { i18n } from '../../../i18n'
import ColorField from '../../../modals/form/ColorField.vue'
import FormModal from '../../../modals/form/FormModal.vue'
import ToggleField from '../../../modals/form/ToggleField.vue'
import type { DefaultTapNoteProperties } from '../../tools/tapNote'

const props = defineProps<{
    properties: DefaultTapNoteProperties
}>()

const emit = defineEmits<{
    close: [properties?: DefaultTapNoteProperties]
}>()

const model = reactive({
    color: {
        isEnabled: props.properties.color !== undefined,
        value: props.properties.color ?? 0,
    },
})

const onSubmit = () => {
    emit('close', {
        color: model.color.isEnabled ? model.color.value : undefined,
    })
}
</script>

<template>
    <FormModal
        :title="i18n.commands.tapNote.modal.title"
        @close="$emit('close')"
        @submit="onSubmit"
    >
        <ToggleField
            v-model="model.color.isEnabled"
            :label="i18n.commands.tapNote.modal.color"
            autofocus
        />
        <ColorField
            v-if="model.color.isEnabled"
            v-model="model.color.value"
            :label="i18n.commands.tapNote.modal.color"
        />
    </FormModal>
</template>
