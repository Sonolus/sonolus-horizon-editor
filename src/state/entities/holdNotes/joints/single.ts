import type { BaseHoldNoteJointEntity } from '.'
import type { HoldNoteId } from '..'
import type { SingleHoldNoteJointObject } from '../../../../chart'

export type SingleHoldNoteJointEntity = BaseHoldNoteJointEntity & {
    type: 'singleHoldNoteJoint'
    color: number
    lane: number
    scaleL: number
    scaleR: number
}

export const toSingleHoldNoteJointEntity = (
    id: HoldNoteId,
    object: SingleHoldNoteJointObject,
): SingleHoldNoteJointEntity => ({
    type: 'singleHoldNoteJoint',
    hitbox: {
        lane: object.lane,
        beat: object.beat,
        w: 0.5,
        t: 0.3,
        b: 0,
    },

    beat: object.beat,
    id,
    color: object.color,
    lane: object.lane,
    scaleL: object.scaleL,
    scaleR: object.scaleR,
})
