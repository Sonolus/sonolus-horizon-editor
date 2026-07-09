import { findIntegral, integrate, type Integral } from '.'
import type { Chart, ValueObject } from '../../chart'
import { beatToTime, type BpmIntegral } from './bpms'

export type TimeScaleIntegral = Integral & {
    beat: number
}

export const createTimeScales = (chart: Chart, bpms: BpmIntegral[]) =>
    calculateTimeScales(bpms, chart.timeScales.map(toTimeScaleIntegral))

export const calculateTimeScales = (bpms: BpmIntegral[], timeScales: TimeScaleIntegral[]) =>
    integrate(
        timeScales
            .sort((a, b) => a.beat - b.beat)
            .map((timeScale): TimeScaleIntegral => ({
                ...timeScale,
                x: beatToTime(bpms, timeScale.beat),
            })),
    )

export const toTimeScaleIntegral = (object: ValueObject): TimeScaleIntegral => ({
    beat: object.beat,
    x: 0,
    y: 0,
    s: object.value,
})

export const timeToScaledTime = (timeScales: TimeScaleIntegral[], time: number) => {
    const { x, y, s } = findIntegral(timeScales, 'x', time)

    return y + (time - x) * s
}

export const scaledTimeToTime = (timeScales: TimeScaleIntegral[], scaledTime: number) => {
    const { x, y, s } = findIntegral(timeScales, 'y', scaledTime)

    return x + (scaledTime - y) / s
}
