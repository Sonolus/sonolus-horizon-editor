import { EngineArchetypeDataName, type LevelDataEntity } from '@sonolus/core'
import Type from 'typebox'
import { getValue } from '..'
import type { ValueObject } from '../..'
import { beatSchema } from '../schemas'

export const parseChartValueObjects = (
    objects: ValueObject[],
    entities: LevelDataEntity[],
    archetype: string,
    dataName: string,
    schema: Type.TNumber,
) => {
    for (const entity of entities) {
        if (entity.archetype !== archetype) continue

        objects.push({
            beat: getValue(entity, EngineArchetypeDataName.Beat, beatSchema),
            value: getValue(entity, dataName, schema),
        })
    }
}
