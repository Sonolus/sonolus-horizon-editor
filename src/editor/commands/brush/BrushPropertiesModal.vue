<script setup lang="ts">
import { reactive } from 'vue'
import { i18n } from '../../../i18n'
import ColorField from '../../../modals/form/ColorField.vue'
import EaseField from '../../../modals/form/EaseField.vue'
import FormModal from '../../../modals/form/FormModal.vue'
import NumberField from '../../../modals/form/NumberField.vue'
import ToggleField from '../../../modals/form/ToggleField.vue'
import type { BrushProperties } from '../../tools/brush'

const props = defineProps<{
    brushProperties: BrushProperties
}>()

const emit = defineEmits<{
    close: [properties?: BrushProperties]
}>()

const model = reactive({
    color: {
        isEnabled: props.brushProperties.color !== undefined,
        value: props.brushProperties.color ?? 0,
    },
    scaleL: {
        isEnabled: props.brushProperties.scaleL !== undefined,
        value: props.brushProperties.scaleL ?? 0,
    },
    scaleR: {
        isEnabled: props.brushProperties.scaleR !== undefined,
        value: props.brushProperties.scaleR ?? 0,
    },
    ease: {
        isEnabled: props.brushProperties.ease !== undefined,
        value: props.brushProperties.ease ?? 'linear',
    },
})

const onSubmit = () => {
    emit('close', {
        color: model.color.isEnabled ? model.color.value : undefined,
        scaleL: model.scaleL.isEnabled ? model.scaleL.value : undefined,
        scaleR: model.scaleR.isEnabled ? model.scaleR.value : undefined,
        ease: model.ease.isEnabled ? model.ease.value : undefined,
    })
}
</script>

<template>
    <FormModal :title="i18n.commands.brush.modal.title" @close="$emit('close')" @submit="onSubmit">
        <ToggleField
            v-model="model.color.isEnabled"
            :label="i18n.commands.brush.modal.color"
            autofocus
        />
        <ColorField
            v-if="model.color.isEnabled"
            v-model="model.color.value"
            :label="i18n.commands.brush.modal.color"
        />

        <ToggleField v-model="model.scaleL.isEnabled" :label="i18n.commands.brush.modal.scaleL" />
        <NumberField
            v-if="model.scaleL.isEnabled"
            v-model="model.scaleL.value"
            :label="i18n.commands.brush.modal.scaleL"
            :min="0"
            :max="1"
            step="any"
        />

        <ToggleField v-model="model.scaleR.isEnabled" :label="i18n.commands.brush.modal.scaleR" />
        <NumberField
            v-if="model.scaleR.isEnabled"
            v-model="model.scaleR.value"
            :label="i18n.commands.brush.modal.scaleR"
            :min="0"
            :max="1"
            step="any"
        />

        <ToggleField
            v-model="model.ease.isEnabled"
            :label="i18n.commands.brush.modal.ease"
            autofocus
        />
        <EaseField
            v-if="model.ease.isEnabled"
            v-model="model.ease.value"
            :label="i18n.commands.brush.modal.ease"
        />
    </FormModal>
</template>
