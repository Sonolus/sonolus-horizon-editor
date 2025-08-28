<script setup lang="ts">
import { computed } from 'vue'
import {
    defaultDoubleHoldNoteProperties,
    setDefaultDoubleHoldNoteProperties,
    type DefaultDoubleHoldNoteProperties,
} from '.'
import { i18n } from '../../../../i18n'
import OptionalColorField from '../../../../modals/form/OptionalColorField.vue'
import OptionalSizeField from '../../../../modals/form/OptionalSizeField.vue'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'

const createModel = <K extends keyof DefaultDoubleHoldNoteProperties>(key: K) =>
    computed({
        get: () => defaultDoubleHoldNoteProperties[key],
        set: (value) => {
            setDefaultDoubleHoldNoteProperties({ ...defaultDoubleHoldNoteProperties, [key]: value })
        },
    })

const color = createModel('color')
const size = createModel('size')
</script>

<template>
    <BaseSidebar :title="i18n.tools.holdNotes.sidebars.doubleHoldNote.title">
        <OptionalColorField v-model="color" />
        <OptionalSizeField v-model="size" />
    </BaseSidebar>
</template>
