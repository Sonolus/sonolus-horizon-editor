import type { EventConnectionEntity } from './connections'
import type { EventJointEntity } from './joints'

export type EventEntity = EventJointEntity | EventConnectionEntity

export type EventEntityType = EventEntity['type']
