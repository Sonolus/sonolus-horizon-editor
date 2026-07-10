<script setup lang="ts">
import { brushProperties } from '.'
import OptionalColorField from '../../../modals/form/OptionalColorField.vue'
import OptionalEaseField from '../../../modals/form/OptionalEaseField.vue'
import OptionalIgnoreTimeScaleField from '../../../modals/form/OptionalIgnoreTimeScaleField.vue'
import OptionalScaleLField from '../../../modals/form/OptionalScaleLField.vue'
import OptionalScaleRField from '../../../modals/form/OptionalScaleRField.vue'
import { useProperties } from '../../utils/properties'

const createModel = useProperties(brushProperties)

const color = createModel('color')
const scaleL = createModel('scaleL')
const scaleR = createModel('scaleR')
const ease = createModel('ease')
const ignoreTimeScale = createModel('ignoreTimeScale')
</script>

<template>
    <OptionalColorField v-model="color" />
    <OptionalScaleLField v-model="scaleL" />
    <OptionalScaleRField v-model="scaleR" />
    <OptionalEaseField v-model="ease" />
    <OptionalIgnoreTimeScaleField v-model="ignoreTimeScale" />
</template>
