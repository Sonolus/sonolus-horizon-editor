import { EngineArchetypeDataName, type LevelDataEntity } from '@sonolus/core'
import type { HoldNoteConnectionEntity } from '../../../state/entities/holdNotes/connections'
import type { HoldNoteJointEntity } from '../../../state/entities/holdNotes/joints'

export const serializeLevelDataHoldNoteEntities = <T extends HoldNoteJointEntity>(
    joints: T[],
    connections: HoldNoteConnectionEntity[],
    getName: () => string,
    jointArchetype: string,
    getJointData: (joint: T) => {
        name: string
        value: number
    }[],
    connectionArchetype: string,
) => {
    const map = new Map<HoldNoteJointEntity, LevelDataEntity>()

    for (const joint of joints) {
        map.set(joint, {
            archetype: jointArchetype,
            data: [
                {
                    name: EngineArchetypeDataName.Beat,
                    value: joint.beat,
                },
                {
                    name: 'color',
                    value: joint.color,
                },
                ...getJointData(joint),
            ],
        })
    }

    return [
        ...map.values(),
        ...connections.map((connection) => {
            const min = map.get(connection.min)
            if (!min) throw new Error('Unexpected min not found')

            const max = map.get(connection.max)
            if (!max) throw new Error('Unexpected max not found')

            return {
                archetype: connectionArchetype,
                data: [
                    {
                        name: 'head',
                        ref: (min.name ??= getName()),
                    },
                    {
                        name: 'tail',
                        ref: (max.name ??= getName()),
                    },
                ],
            }
        }),
    ]
}
