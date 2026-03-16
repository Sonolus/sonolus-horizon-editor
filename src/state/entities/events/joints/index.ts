import type { BaseEntity } from '../..'
import type { Ease, EventObject } from '../../../../chart'
import type { RotateEventJointEntity } from './rotate'
import type { ShiftEventJointEntity } from './shift'
import type { ZoomEventJointEntity } from './zoom'

export type EventJointEntity = RotateEventJointEntity | ShiftEventJointEntity | ZoomEventJointEntity

export type EventJointEntityType = EventJointEntity['type']

export type BaseEventJointEntity = BaseEntity & {
    value: number
    ease: Ease
    ignoreTimeScale: boolean
}

export const toEventJointEntity = (object: EventObject, hitboxLane: number) => ({
    hitbox: {
        lane: hitboxLane,
        beat: object.beat,
        w: 0.1,
        t: 0.1,
        b: 0.1,
    },

    beat: object.beat,
    value: object.value,
    ease: object.ease,
    ignoreTimeScale: object.ignoreTimeScale,
})
