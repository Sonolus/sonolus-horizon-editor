<script setup lang="ts">
import { shallowReactive } from 'vue'
import type { TapNoteObject } from '../../../chart'
import { i18n } from '../../../i18n'
import BeatField from '../../../modals/form/BeatField.vue'
import ColorField from '../../../modals/form/ColorField.vue'
import FormModal from '../../../modals/form/FormModal.vue'
import LaneField from '../../../modals/form/LaneField.vue'

const props = defineProps<{
    object: TapNoteObject
}>()

defineEmits<{
    close: [object?: TapNoteObject]
}>()

const model = shallowReactive({ ...props.object })
</script>

<template>
    <FormModal
        :title="i18n.tools.tapNote.modal.title"
        @close="$emit('close')"
        @submit="$emit('close', model)"
    >
        <ColorField v-model="model.color" />
        <LaneField v-model="model.lane" />
        <BeatField v-model="model.beat" />
    </FormModal>
</template>
