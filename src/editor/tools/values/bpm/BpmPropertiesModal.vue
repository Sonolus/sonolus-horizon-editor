<script setup lang="ts">
import { shallowReactive } from 'vue'
import type { ValueObject } from '../../../../chart'
import { i18n } from '../../../../i18n'
import BeatField from '../../../../modals/form/BeatField.vue'
import BpmField from '../../../../modals/form/BpmField.vue'
import FormModal from '../../../../modals/form/FormModal.vue'

const props = defineProps<{
    object: ValueObject
}>()

defineEmits<{
    close: [object?: ValueObject]
}>()

const model = shallowReactive({ ...props.object })
</script>

<template>
    <FormModal
        :title="i18n.tools.values.modals.bpm.title"
        @close="$emit('close')"
        @submit="$emit('close', model)"
    >
        <BpmField v-model="model.value" autofocus />
        <BeatField v-model="model.beat" />
    </FormModal>
</template>
