import { Type, type TNumber } from '@sinclair/typebox'
import { EngineArchetypeDataName, type LevelDataEntity } from '@sonolus/core'
import { getValue } from '..'
import type { EventObject } from '../..'
import { beatSchema } from '../schemas'

const ease = {
    [-2]: 'one',
    [-1]: 'out',
    0: 'linear',
    1: 'in',
    2: 'zero',
} as const

const easeSchema = Type.Union([
    Type.Literal(-2),
    Type.Literal(-1),
    Type.Literal(0),
    Type.Literal(1),
    Type.Literal(2),
])

export const parseChartEventObjects = (
    objects: EventObject[],
    entities: LevelDataEntity[],
    archetype: string,
    schema: TNumber,
) => {
    for (const entity of entities) {
        if (entity.archetype !== archetype) continue

        objects.push({
            beat: getValue(entity, EngineArchetypeDataName.Beat, beatSchema),
            value: getValue(entity, 'value', schema),
            ease: ease[getValue(entity, 'ease', easeSchema)],
        })
    }
}
