<script setup lang="ts">
import { reactive } from 'vue'
import { i18n } from '../../../../i18n'
import EaseField from '../../../../modals/form/EaseField.vue'
import FormModal from '../../../../modals/form/FormModal.vue'
import ToggleField from '../../../../modals/form/ToggleField.vue'
import type { ZoomEventProperties } from '../../../tools/events/zoom'

const props = defineProps<{
    zoomEventProperties: ZoomEventProperties
}>()

const emit = defineEmits<{
    close: [properties?: ZoomEventProperties]
}>()

const model = reactive({
    ease: {
        isEnabled: props.zoomEventProperties.ease !== undefined,
        value: props.zoomEventProperties.ease ?? 'linear',
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
        :title="i18n.commands.zoomEvent.modal.title"
        @close="$emit('close')"
        @submit="onSubmit"
    >
        <ToggleField
            v-model="model.ease.isEnabled"
            :label="i18n.commands.zoomEvent.modal.ease"
            autofocus
        />
        <EaseField
            v-if="model.ease.isEnabled"
            v-model="model.ease.value"
            :label="i18n.commands.zoomEvent.modal.ease"
        />
    </FormModal>
</template>
