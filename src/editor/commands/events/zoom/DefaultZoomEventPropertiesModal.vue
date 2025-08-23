<script setup lang="ts">
import { shallowReactive } from 'vue'
import { i18n } from '../../../../i18n'
import FormModal from '../../../../modals/form/FormModal.vue'
import OptionalEaseField from '../../../../modals/form/OptionalEaseField.vue'
import type { DefaultZoomEventProperties } from '../../../tools/events/zoom'

const props = defineProps<{
    properties: DefaultZoomEventProperties
}>()

defineEmits<{
    close: [properties?: DefaultZoomEventProperties]
}>()

const model = shallowReactive({ ...props.properties })
</script>

<template>
    <FormModal
        :title="i18n.commands.zoomEvent.modal.title"
        @close="$emit('close')"
        @submit="$emit('close', model)"
    >
        <OptionalEaseField
            v-model="model.ease"
            :label="i18n.commands.zoomEvent.modal.ease"
            autofocus
        />
    </FormModal>
</template>
