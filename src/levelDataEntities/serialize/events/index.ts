import { EngineArchetypeDataName, type LevelDataEntity } from '@sonolus/core'
import type { EventConnectionEntity } from '../../../state/entities/events/connections'
import type { EventJointEntity } from '../../../state/entities/events/joints'

export const serializeLevelDataEventEntities = (
    joints: EventJointEntity[],
    connections: EventConnectionEntity[],
    getName: () => string,
    archetype: string,
) => {
    const map = new Map<EventJointEntity, LevelDataEntity>()

    for (const joint of joints) {
        map.set(joint, {
            archetype,
            data: [
                {
                    name: EngineArchetypeDataName.Beat,
                    value: joint.beat,
                },
                {
                    name: 'value',
                    value: joint.value,
                },
                {
                    name: 'ease',
                    value: {
                        out: -1,
                        linear: 0,
                        in: 1,
                    }[joint.ease],
                },
            ],
        })
    }

    for (const connection of connections) {
        const min = map.get(connection.min)
        if (!min) throw new Error('Unexpected min not found')

        const max = map.get(connection.max)
        if (!max) throw new Error('Unexpected max not found')

        min.data.push({
            name: 'next',
            ref: (max.name ??= getName()),
        })
    }

    return map.values()
}
