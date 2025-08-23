<script setup lang="ts">
import { reactive } from 'vue'
import { i18n } from '../../../../i18n'
import EaseField from '../../../../modals/form/EaseField.vue'
import FormModal from '../../../../modals/form/FormModal.vue'
import ToggleField from '../../../../modals/form/ToggleField.vue'
import type { DefaultRotateEventProperties } from '../../../tools/events/rotate'

const props = defineProps<{
    properties: DefaultRotateEventProperties
}>()

const emit = defineEmits<{
    close: [properties?: DefaultRotateEventProperties]
}>()

const model = reactive({
    ease: {
        isEnabled: props.properties.ease !== undefined,
        value: props.properties.ease ?? 'linear',
    },
})

const onSubmit = () => {
    emit('close', {
        ease: model.ease.isEnabled ? model.ease.value : undefined,
    })
}
</script>

<template>
    <FormModal
        :title="i18n.commands.rotateEvent.modal.title"
        @close="$emit('close')"
        @submit="onSubmit"
    >
        <ToggleField
            v-model="model.ease.isEnabled"
            :label="i18n.commands.rotateEvent.modal.ease"
            autofocus
        />
        <EaseField
            v-if="model.ease.isEnabled"
            v-model="model.ease.value"
            :label="i18n.commands.rotateEvent.modal.ease"
        />
    </FormModal>
</template>
