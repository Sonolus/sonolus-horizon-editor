import { EngineArchetypeDataName, EngineArchetypeName } from '@sonolus/core'
import Type from 'typebox'
import { parseChartValueObjects } from '.'
import { type ParseChart } from '..'

const valueSchema = Type.Number({ exclusiveMinimum: 0 })

export const parseChartBpms: ParseChart = (chart, entities) => {
    parseChartValueObjects(
        chart.bpms,
        entities,
        EngineArchetypeName.BpmChange,
        EngineArchetypeDataName.Bpm,
        valueSchema,
    )
}
