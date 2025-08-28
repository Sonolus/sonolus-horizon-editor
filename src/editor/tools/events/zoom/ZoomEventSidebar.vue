<script setup lang="ts">
import { computed } from 'vue'
import {
    defaultZoomEventProperties,
    setDefaultZoomEventProperties,
    type DefaultZoomEventProperties,
} from '.'
import { i18n } from '../../../../i18n'
import OptionalEaseField from '../../../../modals/form/OptionalEaseField.vue'
import BaseSidebar from '../../../sidebars/BaseSidebar.vue'

const createModel = <K extends keyof DefaultZoomEventProperties>(key: K) =>
    computed({
        get: () => defaultZoomEventProperties[key],
        set: (value) => {
            setDefaultZoomEventProperties({ ...defaultZoomEventProperties, [key]: value })
        },
    })

const ease = createModel('ease')
</script>

<template>
    <BaseSidebar :title="i18n.tools.events.sidebars.zoomEvent.title">
        <OptionalEaseField v-model="ease" />
    </BaseSidebar>
</template>
