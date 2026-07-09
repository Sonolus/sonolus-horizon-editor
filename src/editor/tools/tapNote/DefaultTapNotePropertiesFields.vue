<script setup lang="ts">
import { defaultTapNoteProperties } from '.'
import CopyPropertiesField from '../../../modals/form/CopyPropertiesField.vue'
import OptionalColorField from '../../../modals/form/OptionalColorField.vue'
import { useProperties } from '../../utils/properties'

const createModel = useProperties(defaultTapNoteProperties)

const color = createModel('color')
const copyProperties = createModel('copyProperties')
</script>

<template>
    <OptionalColorField v-model="color" />
    <CopyPropertiesField v-model="copyProperties" />
</template>
