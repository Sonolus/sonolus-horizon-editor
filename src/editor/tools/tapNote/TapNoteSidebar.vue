<script setup lang="ts">
import { computed } from 'vue'
import {
    defaultTapNoteProperties,
    setDefaultTapNoteProperties,
    type DefaultTapNoteProperties,
} from '.'
import { i18n } from '../../../i18n'
import OptionalColorField from '../../../modals/form/OptionalColorField.vue'
import BaseSidebar from '../../sidebars/BaseSidebar.vue'

const createModel = <K extends keyof DefaultTapNoteProperties>(key: K) =>
    computed({
        get: () => defaultTapNoteProperties[key],
        set: (value) => {
            setDefaultTapNoteProperties({ ...defaultTapNoteProperties, [key]: value })
        },
    })

const color = createModel('color')
</script>

<template>
    <BaseSidebar :title="i18n.tools.tapNote.sidebar.title">
        <OptionalColorField v-model="color" />
    </BaseSidebar>
</template>
