import { tool } from '../../../tools'
import { setViewHoverTime } from '../../../view'
import type { Recognizer } from './recognizer'

export const tap = (): Recognizer<1> => ({
    count: 1,

    recognize([, { isActive, st, sx, sy, t, x, y, isShift }]) {
        if (isActive) return false
        if (t - st > 250) return false
        if (Math.hypot(x - sx, y - sy) > 20) return false

        setViewHoverTime(y)
        void tool.value.tap?.(x, y, isShift)
        return true
    },
})
