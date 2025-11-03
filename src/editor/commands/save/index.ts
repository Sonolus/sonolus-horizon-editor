import { saveAs } from 'file-saver'
import { gzip } from 'pako'
import type { Command } from '..'
import { bgm } from '../../../history/bgm'
import { filename } from '../../../history/filename'
import { store } from '../../../history/store'
import { i18n } from '../../../i18n'
import { serializeLevelData } from '../../../levelData/serialize'
import { showModal } from '../../../modals'
import LoadingModal from '../../../modals/LoadingModal.vue'
import { timeout } from '../../../utils/promise'
import { notify } from '../../notification'
import SaveIcon from './SaveIcon.vue'

export const save: Command = {
    title: () => i18n.value.commands.save.title,
    icon: {
        is: SaveIcon,
    },

    execute() {
        void showModal(LoadingModal, {
            title: () => i18n.value.commands.save.title,
            async *task() {
                yield () => i18n.value.commands.save.exporting
                await timeout(50)

                const levelData = serializeLevelData(bgm.value.offset, store.value)

                const file = gzip(JSON.stringify(levelData), {
                    level: 9,
                })
                const blob = new Blob([file], {
                    type: 'application/octet-stream',
                })
                saveAs(blob, filename.value ?? 'LevelData')

                notify(() => i18n.value.commands.save.saved)
            },
        })
    },
}
