import type { Ease } from '../chart'

export const easeValue = (value: number, ease: Ease) => {
    switch (ease) {
        case 'in':
            return value ** 2
        case 'out':
            return 1 - (1 - value) ** 2
        case 'zero':
            return 0
        case 'one':
            return 1
        case 'linear':
            return value
    }
}

export const easeCurve = (sMin: number, sMax: number, ease: 'in' | 'out') => {
    switch (ease) {
        case 'in':
            return sMin * sMax
        case 'out':
            return 1 - (1 - sMin) * (1 - sMax)
    }
}
