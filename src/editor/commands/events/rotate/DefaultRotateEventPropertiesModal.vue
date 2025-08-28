<script setup lang="ts">
import { shallowReactive } from 'vue'
import { i18n } from '../../../../i18n'
import FormModal from '../../../../modals/form/FormModal.vue'
import OptionalEaseField from '../../../../modals/form/OptionalEaseField.vue'
import type { DefaultRotateEventProperties } from '../../../tools/events/rotate'

const props = defineProps<{
    properties: DefaultRotateEventProperties
}>()

defineEmits<{
    close: [properties?: DefaultRotateEventProperties]
}>()

const model = shallowReactive({ ...props.properties })
</script>

<template>
    <FormModal
        :title="i18n.commands.rotateEvent.modal.title"
        @close="$emit('close')"
        @submit="$emit('close', model)"
    >
        <OptionalEaseField v-model="model.ease" />
    </FormModal>
</template>
