<script setup lang="ts">
import { computed } from 'vue'
import { brushProperties, setBrushProperties, type BrushProperties } from '.'
import { i18n } from '../../../i18n'
import OptionalColorField from '../../../modals/form/OptionalColorField.vue'
import OptionalEaseField from '../../../modals/form/OptionalEaseField.vue'
import OptionalScaleLField from '../../../modals/form/OptionalScaleLField.vue'
import OptionalScaleRField from '../../../modals/form/OptionalScaleRField.vue'
import BaseSidebar from '../../sidebars/BaseSidebar.vue'

const createModel = <K extends keyof BrushProperties>(key: K) =>
    computed({
        get: () => brushProperties[key],
        set: (value) => {
            setBrushProperties({ ...brushProperties, [key]: value })
        },
    })

const color = createModel('color')
const scaleL = createModel('scaleL')
const scaleR = createModel('scaleR')
const ease = createModel('ease')
</script>

<template>
    <BaseSidebar :title="i18n.tools.brush.sidebar.title">
        <OptionalColorField v-model="color" />
        <OptionalScaleLField v-model="scaleL" validate />
        <OptionalScaleRField v-model="scaleR" validate />
        <OptionalEaseField v-model="ease" />
    </BaseSidebar>
</template>
