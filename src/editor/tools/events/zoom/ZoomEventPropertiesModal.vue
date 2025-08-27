<script setup lang="ts">
import { shallowReactive } from 'vue'
import type { EventObject } from '../../../../chart'
import { i18n } from '../../../../i18n'
import BeatField from '../../../../modals/form/BeatField.vue'
import EaseField from '../../../../modals/form/EaseField.vue'
import FormModal from '../../../../modals/form/FormModal.vue'
import ValueField from '../../../../modals/form/ValueField.vue'

const props = defineProps<{
    object: EventObject
}>()

defineEmits<{
    close: [zoomEvent?: EventObject]
}>()

const model = shallowReactive({ ...props.object })
</script>

<template>
    <FormModal
        :title="i18n.tools.events.modals.zoomEvent.title"
        @close="$emit('close')"
        @submit="$emit('close', model)"
    >
        <ValueField v-model="model.value" autofocus />
        <EaseField v-model="model.ease" />
        <BeatField v-model="model.beat" />
    </FormModal>
</template>
