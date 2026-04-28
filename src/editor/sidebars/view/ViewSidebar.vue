<script setup lang="ts">
import { computed } from 'vue'
import { i18n } from '../../../i18n'
import SelectField from '../../../modals/form/SelectField.vue'
import ToggleField from '../../../modals/form/ToggleField.vue'
import { entries } from '../../../utils/object'
import { commands } from '../../commands'
import { toolName, tools } from '../../tools'
import { view } from '../../view'
import BaseSidebar from '../BaseSidebar.vue'

const tool = computed({
    get: () => toolName.value,
    set: (tool) => {
        void commands[tool].execute()
    },
})

const toolOptions = computed(() =>
    entries(tools).map(([name, tool]) => [tool.title(), name] as const),
)

const divisions = [1, 2, 3, 4, 6, 8, 12, 16]

const division = computed({
    get: () => view.division,
    set: (division) => {
        switch (division) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 6:
            case 8:
            case 12:
            case 16:
                void commands[`division${division}`].execute()
                break
            default:
                void commands.divisionCustom.execute()
                break
        }
    },
})

const divisionOptions = computed(() =>
    [...divisions, divisions.includes(view.division) ? undefined : view.division].map(
        (division) => [`1/${division ?? 'n'}`, division ?? 0] as const,
    ),
)

const snapping = computed({
    get: () => view.snapping !== 'absolute',
    set: () => {
        void commands.snapping.execute()
    },
})
</script>

<template>
    <BaseSidebar :title="i18n.sidebar.view.title">
        <SelectField v-model="tool" :label="i18n.sidebar.view.tool" :options="toolOptions" />
        <SelectField
            v-model="division"
            :label="i18n.sidebar.view.division"
            :options="divisionOptions"
        />
        <ToggleField
            v-model="snapping"
            :label="i18n.sidebar.view.snapping.label"
            :disabled="i18n.sidebar.view.snapping.absolute"
            :enabled="i18n.sidebar.view.snapping.relative"
        />
    </BaseSidebar>
</template>
