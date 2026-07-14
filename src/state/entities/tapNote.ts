import type { BaseEntity } from '.'
import type { TapNoteObject } from '../../chart'

export type TapNoteEntity = BaseEntity & {
    type: 'tapNote'
    color: number
    lane: number
}

export const toTapNoteEntity = (object: TapNoteObject): TapNoteEntity => ({
    type: 'tapNote',
    hitbox: {
        lane: object.lane,
        beat: object.beat,
        w: 0.5,
        t: 0.15,
        b: 0.15,
    },

    beat: object.beat,
    color: object.color,
    lane: object.lane,
})
