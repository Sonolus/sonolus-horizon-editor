import type { Pointer } from './pointer'
import type { Recognizer } from './recognizers/recognizer'

export const gesture = (...recognizers: Recognizer[]) => {
    let activeRecognizer: Recognizer | undefined

    const pointers = new Map<number, Pointer>()
    let count = 0

    const flush = () => {
        if (activeRecognizer) {
            activeRecognizer.update?.(pointers)
        } else if (pointers.size === count) {
            for (const recognizer of recognizers) {
                if (count !== recognizer.count) continue
                if (!recognizer.recognize(...(pointers.entries() as never as []))) continue

                activeRecognizer = recognizer
                break
            }
        }

        for (const [id, { isActive }] of pointers.entries()) {
            if (!isActive) pointers.delete(id)
        }

        if (pointers.size) {
            count = Math.max(count, pointers.size)
        } else {
            for (const recognizer of recognizers) {
                recognizer.reset?.()
            }
            activeRecognizer = undefined

            count = 0
        }
    }

    const start = (ps: { id: number; x: number; y: number; isShift: boolean }[]) => {
        const t = performance.now()

        for (const { id, x, y, isShift } of ps) {
            pointers.set(id, {
                isActive: true,
                st: t,
                sx: x,
                sy: y,
                t,
                x,
                y,
                isShift,
            })
        }

        flush()
    }

    const move = (ps: { id: number; x: number; y: number; isShift: boolean }[]) => {
        const t = performance.now()

        for (const { id, x, y, isShift } of ps) {
            const pointer = pointers.get(id)
            if (!pointer) continue

            pointer.t = t
            pointer.x = x
            pointer.y = y
            pointer.isShift = isShift
        }

        flush()
    }

    const end = (ps: { id: number; x: number; y: number; isShift: boolean }[]) => {
        const t = performance.now()

        for (const { id, x, y, isShift } of ps) {
            const pointer = pointers.get(id)
            if (!pointer) continue

            pointer.isActive = false
            pointer.t = t
            pointer.x = x
            pointer.y = y
            pointer.isShift = isShift
        }

        flush()
    }

    return {
        get pointerCount() {
            return pointers.size
        },

        start,
        move,
        end,
    }
}
