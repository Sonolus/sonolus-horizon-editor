<script setup lang="ts">
import { shallowReactive } from 'vue'
import { i18n } from '../../../../i18n'
import FormModal from '../../../../modals/form/FormModal.vue'
import OptionalEaseField from '../../../../modals/form/OptionalEaseField.vue'
import type { DefaultShiftEventProperties } from '../../../tools/events/shift'

const props = defineProps<{
    properties: DefaultShiftEventProperties
}>()

defineEmits<{
    close: [properties?: DefaultShiftEventProperties]
}>()

const model = shallowReactive({ ...props.properties })
</script>

<template>
    <FormModal
        :title="i18n.commands.shiftEvent.modal.title"
        @close="$emit('close')"
        @submit="$emit('close', model)"
    >
        <OptionalEaseField v-model="model.ease" autofocus />
    </FormModal>
</template>
