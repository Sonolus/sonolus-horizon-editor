<script setup lang="ts">
import { defaultShiftEventProperties } from '.'
import { i18n } from '../../../../i18n'
import CopyPropertiesField from '../../../../modals/form/CopyPropertiesField.vue'
import OptionalEaseField from '../../../../modals/form/OptionalEaseField.vue'
import OptionalIgnoreTimeScaleField from '../../../../modals/form/OptionalIgnoreTimeScaleField.vue'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'
import { useProperties } from '../../../utils/properties'

const createModel = useProperties(defaultShiftEventProperties)

const ease = createModel('ease')
const ignoreTimeScale = createModel('ignoreTimeScale')
const copyProperties = createModel('copyProperties')
</script>

<template>
    <BaseSidebar :title="i18n.tools.events.sidebars.shiftEvent.title">
        <OptionalEaseField v-model="ease" />
        <OptionalIgnoreTimeScaleField v-model="ignoreTimeScale" />
        <CopyPropertiesField v-model="copyProperties" />
    </BaseSidebar>
</template>
