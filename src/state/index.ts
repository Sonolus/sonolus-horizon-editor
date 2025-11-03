import type { Chart } from '../chart'
import type { Bgm } from './bgm'
import type { Entity } from './entities'
import { createBpms, type BpmIntegral } from './integrals/bpms'
import { createTimeScales, type TimeScaleIntegral } from './integrals/timeScales'
import type { Store } from './store'
import { createStore } from './store/creates'

export type State = {
    filename?: string

    bgm: Bgm
    store: Store
    bpms: BpmIntegral[]
    timeScales: TimeScaleIntegral[]

    selectedEntities: Entity[]
}

export const createState = (chart: Chart, offset: number, filename?: string): State => {
    const bpms = createBpms(chart)

    return {
        filename,

        bgm: { offset },
        store: createStore(chart),
        bpms,
        timeScales: createTimeScales(chart, bpms),

        selectedEntities: [],
    }
}
