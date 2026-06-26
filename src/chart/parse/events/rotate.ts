import Type from 'typebox'
import { parseChartEventObjects } from '.'
import type { ParseChart } from '..'

const valueSchema = Type.Number()

export const parseChartRotateEvents: ParseChart = (chart, entities) => {
    parseChartEventObjects(chart.rotateEvents, entities, 'RotateEvent', valueSchema)
}
