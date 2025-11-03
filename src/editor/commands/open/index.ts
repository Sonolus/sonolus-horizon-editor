import { ungzip } from 'pako'
import type { Command } from '..'
import { parseChart } from '../../../chart/parse'
import { validateChart } from '../../../chart/validate'
import { checkState, resetState } from '../../../history'
import { i18n } from '../../../i18n'
import { parseLevelData } from '../../../levelData/parse'
import { showModal } from '../../../modals'
import LoadingModal from '../../../modals/LoadingModal.vue'
import { getFilename, pickFile } from '../../../utils/file'
import { timeout } from '../../../utils/promise'
import { notify } from '../../notification'
import OpenIcon from './OpenIcon.vue'

export const open: Command = {
    title: () => i18n.value.commands.open.title,
    icon: {
        is: OpenIcon,
    },

    async execute() {
        if (!(await checkState())) return

        const file = await pickFile()
        if (!file) return

        await showModal(LoadingModal, {
            title: () => i18n.value.commands.open.title,
            async *task() {
                yield () => i18n.value.commands.open.loading

                const buffer = await file.arrayBuffer()

                yield () => i18n.value.commands.open.importing
                await timeout(50)

                const levelData = parseLevelData(
                    JSON.parse(new TextDecoder().decode(ungzip(buffer))),
                )

                const chart = parseChart(levelData.entities)
                validateChart(chart)

                resetState(chart, levelData.bgmOffset, getFilename(file))

                notify(() => i18n.value.commands.open.opened)
            },
        })
    },
}
