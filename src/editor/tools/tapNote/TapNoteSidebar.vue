<script setup lang="ts">
import { defaultTapNoteProperties, setDefaultTapNoteProperties } from '.'
import { i18n } from '../../../i18n'
import OptionalColorField from '../../../modals/form/OptionalColorField.vue'
import BaseSidebar from '../../sidebars/BaseSidebar.vue'
import { useProperties } from '../../utils/properties'

const createModel = useProperties(() => defaultTapNoteProperties, setDefaultTapNoteProperties)

const color = createModel('color')
</script>

<template>
    <BaseSidebar :title="i18n.tools.tapNote.sidebar.title">
        <OptionalColorField v-model="color" />
    </BaseSidebar>
</template>
