import type { Command } from '..'
import { setClipboardData } from '../../../clipboard/index.ts'
import { pushState, replaceState, state } from '../../../history'
import { selectedEntities } from '../../../history/selectedEntities'
import { i18n } from '../../../i18n'
import { serializeLevelDataEntities } from '../../../levelDataEntities/serialize'
import type { Entity, EntityOfType, EntityType } from '../../../state/entities'
import type { HoldNoteId } from '../../../state/entities/holdNotes'
import type { HoldNoteConnectionEntityType } from '../../../state/entities/holdNotes/connections'
import { toDoubleHoldNoteConnectionEntity } from '../../../state/entities/holdNotes/connections/double'
import { toSingleHoldNoteConnectionEntity } from '../../../state/entities/holdNotes/connections/single'
import type { HoldNoteJointEntityType } from '../../../state/entities/holdNotes/joints'
import type { RemoveMutation } from '../../../state/mutations'
import { removeRotateEventJoint } from '../../../state/mutations/events/rotate'
import { removeShiftEventJoint } from '../../../state/mutations/events/shift'
import { removeZoomEventJoint } from '../../../state/mutations/events/zoom'
import { removeDoubleHoldNoteJoint } from '../../../state/mutations/holdNotes/double'
import { removeSingleHoldNoteJoint } from '../../../state/mutations/holdNotes/single'
import { removeTapNote } from '../../../state/mutations/tapNote'
import { removeBpm } from '../../../state/mutations/values/bpm'
import { removeTimeScale } from '../../../state/mutations/values/timeScale'
import { createTransaction } from '../../../state/transaction'
import { interpolate } from '../../../utils/interpolate'
import { notify } from '../../notification'
import { view, xToLane, yToValidBeat } from '../../view'
import CutIcon from './CutIcon.vue'

export const cut: Command = {
    title: () => i18n.value.commands.cut.title,
    icon: {
        is: CutIcon,
    },

    execute() {
        const entities = selectedEntities.value

        if (!entities.length) {
            notify(() => i18n.value.commands.cut.noSelected)
            return
        }

        setClipboardData({
            lane: xToLane(view.pointer.x),
            beat: yToValidBeat(view.pointer.y),
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
        })

        const removeEntities = entities.filter(
            (entity) => canRemoves[entity.type]?.(entity as never) ?? true,
        )
        if (!removeEntities.length) {
            replaceState({
                ...state.value,
                selectedEntities: [],
            })
            view.entities = {
                hovered: [],
                creating: [],
            }
        } else {
            const transaction = createTransaction(state.value)

            for (const entity of removeEntities) {
                removes[entity.type]?.(transaction, entity as never)
            }

            pushState(
                interpolate(() => i18n.value.commands.cut.cut, `${entities.length}`),
                {
                    ...transaction.commit(),
                    selectedEntities: [],
                },
            )
            view.entities = {
                hovered: [],
                creating: [],
            }
        }

        notify(interpolate(() => i18n.value.commands.cut.cut, `${entities.length}`))
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

const canRemoves: {
    [T in Entity as T['type']]?: (entity: T) => boolean
} = {
    bpm: (entity) => entity.beat > 0,
    timeScale: (entity) => entity.beat > 0,
}

const removes: {
    [T in Entity as T['type']]?: RemoveMutation<T>
} = {
    bpm: removeBpm,
    timeScale: removeTimeScale,

    rotateEventJoint: removeRotateEventJoint,
    shiftEventJoint: removeShiftEventJoint,
    zoomEventJoint: removeZoomEventJoint,

    tapNote: removeTapNote,
    singleHoldNoteJoint: removeSingleHoldNoteJoint,
    doubleHoldNoteJoint: removeDoubleHoldNoteJoint,
}
