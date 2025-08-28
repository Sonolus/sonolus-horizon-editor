<script setup lang="ts">
import { computed } from 'vue'
import {
    defaultRotateEventProperties,
    setDefaultRotateEventProperties,
    type DefaultRotateEventProperties,
} from '.'
import { i18n } from '../../../../i18n'
import OptionalEaseField from '../../../../modals/form/OptionalEaseField.vue'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'

const createModel = <K extends keyof DefaultRotateEventProperties>(key: K) =>
    computed({
        get: () => defaultRotateEventProperties[key],
        set: (value) => {
            setDefaultRotateEventProperties({ ...defaultRotateEventProperties, [key]: value })
        },
    })

const ease = createModel('ease')
</script>

<template>
    <BaseSidebar :title="i18n.tools.events.sidebars.rotateEvent.title">
        <OptionalEaseField v-model="ease" />
    </BaseSidebar>
</template>
