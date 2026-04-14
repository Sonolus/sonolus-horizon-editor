<script setup lang="ts">
import { defaultTapNoteProperties } from '.'
import { i18n } from '../../../i18n'
import CopyPropertiesField from '../../../modals/form/CopyPropertiesField.vue'
import OptionalColorField from '../../../modals/form/OptionalColorField.vue'
import BaseSidebar from '../../sidebars/BaseSidebar.vue'
import { useProperties } from '../../utils/properties'

const createModel = useProperties(defaultTapNoteProperties)

const color = createModel('color')
const copyProperties = createModel('copyProperties')
</script>

<template>
    <BaseSidebar :title="i18n.tools.tapNote.sidebar.title">
        <OptionalColorField v-model="color" />
        <CopyPropertiesField v-model="copyProperties" />
    </BaseSidebar>
</template>
