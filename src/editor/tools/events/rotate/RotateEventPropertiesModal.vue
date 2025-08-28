<script setup lang="ts">
import { shallowReactive } from 'vue'
import type { EventObject } from '../../../../chart'
import { i18n } from '../../../../i18n'
import BeatField from '../../../../modals/form/BeatField.vue'
import EaseField from '../../../../modals/form/EaseField.vue'
import FormModal from '../../../../modals/form/FormModal.vue'
import RotateValueField from '../../../../modals/form/RotateValueField.vue'

const props = defineProps<{
    object: EventObject
}>()

defineEmits<{
    close: [object?: EventObject]
}>()

const model = shallowReactive({ ...props.object })
</script>

<template>
    <FormModal
        :title="i18n.tools.events.modals.rotateEvent.title"
        @close="$emit('close')"
        @submit="$emit('close', model)"
    >
        <RotateValueField v-model="model.value" autofocus />
        <EaseField v-model="model.ease" />
        <BeatField v-model="model.beat" />
    </FormModal>
</template>
