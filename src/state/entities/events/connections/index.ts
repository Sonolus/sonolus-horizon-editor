import type { BaseEntity } from '../..'
import type { Range } from '../../../../utils/range'
import type { EventJointEntity } from '../joints'
import type { RotateEventConnectionEntity } from './rotate'
import type { ShiftEventConnectionEntity } from './shift'
import type { ZoomEventConnectionEntity } from './zoom'

export type EventConnectionEntity =
    RotateEventConnectionEntity | ShiftEventConnectionEntity | ZoomEventConnectionEntity

export type EventConnectionEntityType = EventConnectionEntity['type']

export type BaseEventConnectionEntity<T extends EventJointEntity> = BaseEntity & Range<T>

export const toEventConnectionEntity = <T extends EventJointEntity>(min: T, max: T) => ({
    beat: min.beat,
    min,
    max,
})
