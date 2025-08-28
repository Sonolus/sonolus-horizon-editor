<script setup lang="ts">
import { shallowReactive } from 'vue'
import { i18n } from '../../../i18n'
import FormModal from '../../../modals/form/FormModal.vue'
import OptionalColorField from '../../../modals/form/OptionalColorField.vue'
import OptionalEaseField from '../../../modals/form/OptionalEaseField.vue'
import OptionalScaleLField from '../../../modals/form/OptionalScaleLField.vue'
import OptionalScaleRField from '../../../modals/form/OptionalScaleRField.vue'
import type { BrushProperties } from '../../tools/brush'

const props = defineProps<{
    properties: BrushProperties
}>()

defineEmits<{
    close: [properties?: BrushProperties]
}>()

const model = shallowReactive({ ...props.properties })
</script>

<template>
    <FormModal
        :title="i18n.commands.brush.modal.title"
        @close="$emit('close')"
        @submit="$emit('close', model)"
    >
        <OptionalColorField v-model="model.color" />
        <OptionalScaleLField v-model="model.scaleL" />
        <OptionalScaleRField v-model="model.scaleR" />
        <OptionalEaseField v-model="model.ease" />
    </FormModal>
</template>
