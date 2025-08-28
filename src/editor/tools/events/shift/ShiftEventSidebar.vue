<script setup lang="ts">
import { computed } from 'vue'
import {
    defaultShiftEventProperties,
    setDefaultShiftEventProperties,
    type DefaultShiftEventProperties,
} from '.'
import { i18n } from '../../../../i18n'
import OptionalEaseField from '../../../../modals/form/OptionalEaseField.vue'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'

const createModel = <K extends keyof DefaultShiftEventProperties>(key: K) =>
    computed({
        get: () => defaultShiftEventProperties[key],
        set: (value) => {
            setDefaultShiftEventProperties({ ...defaultShiftEventProperties, [key]: value })
        },
    })

const ease = createModel('ease')
</script>

<template>
    <BaseSidebar :title="i18n.tools.events.sidebars.shiftEvent.title">
        <OptionalEaseField v-model="ease" />
    </BaseSidebar>
</template>
