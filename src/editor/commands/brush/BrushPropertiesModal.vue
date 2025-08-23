<script setup lang="ts">
import { shallowReactive } from 'vue'
import { i18n } from '../../../i18n'
import FormModal from '../../../modals/form/FormModal.vue'
import OptionalColorField from '../../../modals/form/OptionalColorField.vue'
import OptionalEaseField from '../../../modals/form/OptionalEaseField.vue'
import OptionalNumberField from '../../../modals/form/OptionalNumberField.vue'
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
        <OptionalColorField
            v-model="model.color"
            :label="i18n.commands.brush.modal.color"
            autofocus
        />
        <OptionalNumberField
            v-model="model.scaleL"
            :label="i18n.commands.brush.modal.scaleL"
            :default-value="0"
            :min="0"
            :max="1"
            step="any"
        />
        <OptionalNumberField
            v-model="model.scaleR"
            :label="i18n.commands.brush.modal.scaleR"
            :default-value="0"
            :min="0"
            :max="1"
            step="any"
        />
        <OptionalEaseField v-model="model.ease" :label="i18n.commands.brush.modal.ease" />
    </FormModal>
</template>
