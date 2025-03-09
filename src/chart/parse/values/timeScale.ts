import { Type } from '@sinclair/typebox'
import { EngineArchetypeDataName, EngineArchetypeName } from '@sonolus/core'
import { parseChartValueObjects } from '.'
import { type ParseChart } from '..'

const valueSchema = Type.Number({ exclusiveMinimum: 0 })

export const parseChartTimeScales: ParseChart = (chart, entities) => {
    parseChartValueObjects(
        chart.timeScales,
        entities,
        EngineArchetypeName.TimeScaleChange,
        EngineArchetypeDataName.TimeScale,
        valueSchema,
    )
}
