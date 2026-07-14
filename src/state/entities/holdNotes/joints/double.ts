import type { BaseHoldNoteJointEntity } from '.'
import type { HoldNoteId } from '..'
import type { DoubleHoldNoteJointObject } from '../../../../chart'

export type DoubleHoldNoteJointEntity = BaseHoldNoteJointEntity & {
    type: 'doubleHoldNoteJoint'
    color: number
    laneL: number
    laneR: number
}

export const toDoubleHoldNoteJointEntity = (
    id: HoldNoteId,
    object: DoubleHoldNoteJointObject,
): DoubleHoldNoteJointEntity => ({
    type: 'doubleHoldNoteJoint',
    hitbox: {
        lane: (object.laneL + object.laneR) / 2,
        beat: object.beat,
        w: (Math.abs(object.laneL - object.laneR) + 1) / 2,
        t: 0.3,
        b: 0,
    },

    beat: object.beat,
    id,
    color: object.color,
    laneL: object.laneL,
    laneR: object.laneR,
})
