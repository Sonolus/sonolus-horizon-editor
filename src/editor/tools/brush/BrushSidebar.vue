<script setup lang="ts">
import { brushProperties, setBrushProperties } from '.'
import { i18n } from '../../../i18n'
import OptionalColorField from '../../../modals/form/OptionalColorField.vue'
import OptionalEaseField from '../../../modals/form/OptionalEaseField.vue'
import OptionalScaleLField from '../../../modals/form/OptionalScaleLField.vue'
import OptionalScaleRField from '../../../modals/form/OptionalScaleRField.vue'
import BaseSidebar from '../../sidebars/BaseSidebar.vue'
import { useProperties } from '../../utils/properties'

const createModel = useProperties(() => brushProperties, setBrushProperties)

const color = createModel('color')
const scaleL = createModel('scaleL')
const scaleR = createModel('scaleR')
const ease = createModel('ease')
</script>

<template>
    <BaseSidebar :title="i18n.tools.brush.sidebar.title">
        <OptionalColorField v-model="color" />
        <OptionalScaleLField v-model="scaleL" />
        <OptionalScaleRField v-model="scaleR" />
        <OptionalEaseField v-model="ease" />
    </BaseSidebar>
</template>
