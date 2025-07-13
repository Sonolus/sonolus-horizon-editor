import type { Command } from '..'
import type { ClipboardData } from '../../../clipboardData/schema'
import { selectedEntities } from '../../../history/selectedEntities'
import { i18n } from '../../../i18n'
import { serializeLevelDataEntities } from '../../../levelDataEntities/serialize'
import type { Entity, EntityOfType, EntityType } from '../../../state/entities'
import type { HoldNoteId } from '../../../state/entities/holdNotes'
import type { HoldNoteConnectionEntityType } from '../../../state/entities/holdNotes/connections'
import { toDoubleHoldNoteConnectionEntity } from '../../../state/entities/holdNotes/connections/double'
import { toSingleHoldNoteConnectionEntity } from '../../../state/entities/holdNotes/connections/single'
import type { HoldNoteJointEntityType } from '../../../state/entities/holdNotes/joints'
import { interpolate } from '../../../utils/interpolate'
import { notify } from '../../notification'
import { hitEntitiesAtPoint } from '../../tools/utils'
import { view, xToLane, yToValidBeat } from '../../view'
import CopyIcon from './CopyIcon.vue'

export const copy: Command = {
    title: () => i18n.value.commands.copy.title,
    icon: {
        is: CopyIcon,
    },

    async execute() {
        const entities = selectedEntities.value

        if (!entities.length) {
            notify(() => i18n.value.commands.copy.noSelected)
            return
        }

        const [entity] = hitEntitiesAtPoint(view.pointer.x, view.pointer.y).filter((entity) =>
            entities.includes(entity),
        )

        const data: ClipboardData = {
            lane: xToLane(view.pointer.x),
            beat: entity?.beat ?? yToValidBeat(view.pointer.y),
            entities: serializeLevelDataEntities(
                getEntities(entities, 'bpm'),
                getEntities(entities, 'timeScale'),

                getEntities(entities, 'rotateEventJoint'),
                [],
                getEntities(entities, 'shiftEventJoint'),
                [],
                getEntities(entities, 'zoomEventJoint'),
                [],

                getEntities(entities, 'tapNote'),

                ...getHoldNoteEntities(
                    entities,
                    'singleHoldNoteJoint',
                    toSingleHoldNoteConnectionEntity,
                ),
                ...getHoldNoteEntities(
                    entities,
                    'doubleHoldNoteJoint',
                    toDoubleHoldNoteConnectionEntity,
                ),
            ),
        }
        const text = JSON.stringify(data)

        await navigator.clipboard.writeText(text)

        notify(interpolate(() => i18n.value.commands.copy.copied, `${entities.length}`))
    },
}

const getEntities = <T extends EntityType>(entities: Entity[], type: T) =>
    entities.filter((entity): entity is EntityOfType<T> => entity.type === type)

const getHoldNoteEntities = <
    T extends HoldNoteJointEntityType,
    U extends HoldNoteConnectionEntityType,
>(
    entities: Entity[],
    type: T,
    toConnectionEntity: (min: EntityOfType<T>, max: EntityOfType<T>) => EntityOfType<U>,
): [EntityOfType<T>[], EntityOfType<U>[]] => {
    const joints = getEntities(entities, type)
    const connections: EntityOfType<U>[] = []

    const map = new Map<HoldNoteId, EntityOfType<T>[]>()

    for (const joint of joints) {
        const group = map.get(joint.id)
        if (group) {
            group.push(joint)
        } else {
            map.set(joint.id, [joint])
        }
    }

    for (const group of map.values()) {
        let prev: EntityOfType<T> | undefined
        for (const joint of group.sort((a, b) => a.beat - b.beat)) {
            if (prev) connections.push(toConnectionEntity(prev, joint))

            prev = joint
        }
    }

    return [joints, connections]
}
