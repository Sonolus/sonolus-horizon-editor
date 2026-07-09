import type { BaseEntity } from '../..'
import type { Range } from '../../../../utils/range'
import type { HoldNoteJointEntity } from '../joints'
import type { DoubleHoldNoteConnectionEntity } from './double'
import type { SingleHoldNoteConnectionEntity } from './single'

export type HoldNoteConnectionEntity =
    SingleHoldNoteConnectionEntity | DoubleHoldNoteConnectionEntity

export type HoldNoteConnectionEntityType = HoldNoteConnectionEntity['type']

export type BaseHoldNoteConnectionEntity<T extends HoldNoteJointEntity> = BaseEntity & Range<T>

export const toHoldNoteConnectionEntity = <T extends HoldNoteJointEntity>(min: T, max: T) => ({
    beat: min.beat,
    min,
    max,
})
