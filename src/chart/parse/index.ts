import { type LevelDataEntity } from '@sonolus/core'
import Type from 'typebox'
import Value from 'typebox/value'
import type { Chart } from '..'
import { parseChartRotateEvents } from './events/rotate'
import { parseChartShiftEvents } from './events/shift'
import { parseChartZoomEvents } from './events/zoom'
import { parseChartDoubleHoldNotes } from './holdNotes/double'
import { parseChartSingleHoldNotes } from './holdNotes/single'
import { parseChartTapNotes } from './tapNote'
import { parseChartBpms } from './values/bpm'
import { parseChartTimeScales } from './values/timeScale'

export type ParseChart = (chart: Chart, entities: LevelDataEntity[]) => void

export const parseChart = (entities: LevelDataEntity[]): Chart => {
    const chart: Chart = {
        bpms: [],
        timeScales: [],
        rotateEvents: [],
        shiftEvents: [],
        zoomEvents: [],
        tapNotes: [],
        singleHoldNotes: [],
        doubleHoldNotes: [],
    }

    parseChartBpms(chart, entities)
    parseChartTimeScales(chart, entities)

    parseChartRotateEvents(chart, entities)
    parseChartShiftEvents(chart, entities)
    parseChartZoomEvents(chart, entities)

    parseChartTapNotes(chart, entities)

    parseChartSingleHoldNotes(chart, entities)
    parseChartDoubleHoldNotes(chart, entities)

    return chart
}

export const getValue = <T extends Type.TSchema>(
    entity: LevelDataEntity,
    name: string,
    schema: T,
) => {
    const data = entity.data.find((data) => data.name === name)
    if (!data) throw new Error(`Invalid level: ${name} not found`)
    if (!('value' in data)) throw new Error(`Invalid level: ${name} has no value`)

    Value.Assert(schema, data.value)
    return data.value
}

export const getOptionalValue = <T extends Type.TSchema>(
    entity: LevelDataEntity,
    name: string,
    schema: T,
) => {
    const data = entity.data.find((data) => data.name === name)
    if (!data) return
    if (!('value' in data)) return

    Value.Assert(schema, data.value)
    return data.value
}

export const getRef = (entity: LevelDataEntity, name: string) => {
    const data = entity.data.find((data) => data.name === name)
    if (!data) throw new Error(`Invalid level: ${name} not found`)
    if (!('ref' in data)) throw new Error(`Invalid level: ${name} has no ref`)

    return data.ref
}
