import { type Tool } from '.'
import type {
    DoubleHoldNoteJointObject,
    EventObject,
    SingleHoldNoteJointObject,
    TapNoteObject,
    ValueObject,
} from '../../chart'
import { pushState, replaceState, state } from '../../history'
import { selectedEntities } from '../../history/selectedEntities'
import { i18n } from '../../i18n'
import type { Entity, EntityOfType } from '../../state/entities'
import type { EventJointEntityType } from '../../state/entities/events/joints'
import {
    toRotateEventJointEntity,
    type RotateEventJointEntity,
} from '../../state/entities/events/joints/rotate'
import {
    laneToShiftEventValue,
    toShiftEventJointEntity,
} from '../../state/entities/events/joints/shift'
import {
    laneToZoomEventValue,
    toZoomEventJointEntity,
} from '../../state/entities/events/joints/zoom'
import {
    toDoubleHoldNoteJointEntity,
    type DoubleHoldNoteJointEntity,
} from '../../state/entities/holdNotes/joints/double'
import {
    toSingleHoldNoteJointEntity,
    type SingleHoldNoteJointEntity,
} from '../../state/entities/holdNotes/joints/single'
import { toTapNoteEntity, type TapNoteEntity } from '../../state/entities/tapNote'
import type { ValueEntity, ValueEntityType } from '../../state/entities/values'
import { toBpmEntity } from '../../state/entities/values/bpm'
import { toTimeScaleEntity } from '../../state/entities/values/timeScale'
import type { AddMutation, RemoveMutation } from '../../state/mutations'
import { addRotateEventJoint, removeRotateEventJoint } from '../../state/mutations/events/rotate'
import { addShiftEventJoint, removeShiftEventJoint } from '../../state/mutations/events/shift'
import { addZoomEventJoint, removeZoomEventJoint } from '../../state/mutations/events/zoom'
import {
    addDoubleHoldNoteJoint,
    removeDoubleHoldNoteJoint,
} from '../../state/mutations/holdNotes/double'
import {
    addSingleHoldNoteJoint,
    removeSingleHoldNoteJoint,
} from '../../state/mutations/holdNotes/single'
import { addTapNote, removeTapNote } from '../../state/mutations/tapNote'
import { addBpm, removeBpm } from '../../state/mutations/values/bpm'
import { addTimeScale, removeTimeScale } from '../../state/mutations/values/timeScale'
import { getInStoreGrid } from '../../state/store/grid'
import { createTransaction, type Transaction } from '../../state/transaction'
import { interpolate } from '../../utils/interpolate'
import { align, clamp, mod } from '../../utils/math'
import { notify } from '../notification'
import {
    focusViewAtBeat,
    setViewHover,
    view,
    xToLane,
    yToBeatOffset,
    yToTime,
    yToValidBeat,
} from '../view'
import { hitEntitiesAtPoint, hitEntitiesInSelection, modifyEntities, toSelection } from './utils'

let active:
    | {
          type: 'select'
          lane: number
          time: number
          count: number
          entities: Entity[]
      }
    | {
          type: 'move'
          lane: number
          focus: Entity
          entities: Entity[]
      }
    | undefined

export const select: Tool = {
    hover(x, y, modifiers) {
        const entities = modifyEntities(hitEntitiesAtPoint(x, y), modifiers)

        view.entities = {
            hovered: entities,
            creating: [],
        }
    },

    tap(x, y, modifiers) {
        if (modifiers.shift) {
            const entities = modifyEntities(hitEntitiesAtPoint(x, y), modifiers)

            const [entity] = entities
            if (!entity) return

            const targets = entities.every((entity) => selectedEntities.value.includes(entity))
                ? selectedEntities.value.filter((entity) => !entities.includes(entity))
                : [...new Set([...selectedEntities.value, ...entities])]

            replaceState({
                ...state.value,
                selectedEntities: targets,
            })
            view.entities = {
                hovered: entities,
                creating: [],
            }

            focusViewAtBeat(entity.beat)
            notify(interpolate(() => i18n.value.tools.select.selected, `${targets.length}`))
        } else {
            const entities = hitEntitiesAtPoint(x, y)

            const selectedLength = selectedEntities.value.length
            const current = selectedLength ? selectedEntities.value[0] : undefined

            const index = current ? (entities.indexOf(current) + 1) % entities.length : 0
            const entity = entities[index]
            const targets = modifyEntities(entity ? [entity] : [], modifiers)

            replaceState({
                ...state.value,
                selectedEntities: targets,
            })
            view.entities = {
                hovered: entities,
                creating: [],
            }

            if (entity) {
                focusViewAtBeat(entity.beat)
                notify(interpolate(() => i18n.value.tools.select.selected, `${targets.length}`))
            } else {
                focusViewAtBeat(yToValidBeat(y))
                if (selectedLength) notify(() => i18n.value.tools.select.deselected)
            }
        }
    },

    dragStart(x, y) {
        const lane = xToLane(x)
        const time = yToTime(y)

        const entities = hitEntitiesAtPoint(x, y)

        const [focus] = entities.filter((entity) => selectedEntities.value.includes(entity))
        if (focus) {
            active = {
                type: 'move',
                lane,
                focus,
                entities: selectedEntities.value,
            }

            focusViewAtBeat(focus.beat)
            notify(interpolate(() => i18n.value.tools.select.moving, `${active.entities.length}`))
        } else {
            const [entity] = entities
            if (entity) {
                replaceState({
                    ...state.value,
                    selectedEntities: [entity],
                })
                view.entities = {
                    hovered: [],
                    creating: [],
                }

                active = {
                    type: 'move',
                    lane,
                    focus: entity,
                    entities: [entity],
                }

                focusViewAtBeat(entity.beat)
                notify(interpolate(() => i18n.value.tools.select.moving, '1'))
            } else {
                active = {
                    type: 'select',
                    lane,
                    time,
                    count: -1,
                    entities: selectedEntities.value,
                }
            }
        }

        return true
    },

    dragUpdate(x, y, modifiers) {
        if (!active) return

        setViewHover(x, y)

        if (active.type === 'select') {
            const selection = toSelection(active.lane, active.time, x, y)
            const entities = modifyEntities(hitEntitiesInSelection(selection), modifiers)
            const targets = modifiers.shift
                ? [...new Set([...active.entities, ...entities])]
                : entities

            replaceState({
                ...state.value,
                selectedEntities: targets,
            })
            view.selection = selection
            view.entities = {
                hovered: [],
                creating: [],
            }

            if (active.count === targets.length) return
            active.count = targets.length

            notify(interpolate(() => i18n.value.tools.select.selecting, `${targets.length}`))
        } else {
            const lane = xToLane(x)
            const beatOffset = yToBeatOffset(y, active.focus.beat)

            const creating: Entity[] = []
            for (const entity of active.entities) {
                const beat = entity.beat + beatOffset
                if (beat < 0) continue

                const result = creates[entity.type]?.(
                    active.entities,
                    entity as never,
                    active.lane,
                    lane,
                    beat,
                    active.focus,
                )
                if (!result) continue

                creating.push(result)
            }

            view.entities = {
                hovered: [],
                creating,
            }
        }
    },

    dragEnd(x, y, modifiers) {
        if (!active) return

        if (active.type === 'select') {
            const selection = toSelection(active.lane, active.time, x, y)
            const entities = modifyEntities(hitEntitiesInSelection(selection), modifiers)
            const targets = modifiers.shift
                ? [...new Set([...active.entities, ...entities])]
                : entities

            replaceState({
                ...state.value,
                selectedEntities: targets,
            })
            view.selection = undefined
            view.entities = {
                hovered: [],
                creating: [],
            }

            notify(interpolate(() => i18n.value.tools.select.selected, `${targets.length}`))
        } else {
            const transaction = createTransaction(state.value)

            const lane = xToLane(x)
            const beatOffset = yToBeatOffset(y, active.focus.beat)

            const entities = active.entities.sort(
                beatOffset > 0 ? (a, b) => b.beat - a.beat : (a, b) => a.beat - b.beat,
            )

            const selectedEntities: Entity[] = []
            for (const entity of entities) {
                const beat = entity.beat + beatOffset
                if (beat < 0) continue

                const result = moves[entity.type]?.(
                    transaction,
                    entities,
                    entity as never,
                    active.lane,
                    lane,
                    beat,
                    active.focus,
                )
                if (!result) continue

                selectedEntities.push(...result)
            }

            pushState(
                interpolate(() => i18n.value.tools.select.moved, `${selectedEntities.length}`),
                {
                    ...transaction.commit(),
                    selectedEntities,
                },
            )
            view.entities = {
                hovered: [],
                creating: [],
            }

            notify(interpolate(() => i18n.value.tools.select.moved, `${selectedEntities.length}`))
        }

        active = undefined
    },
}

const toMovedValueObject = (entity: ValueEntity, beat: number): ValueObject => ({
    beat,
    value: entity.value,
})

const toMovedEventObject = <T extends EventJointEntityType>(
    type: T,
    laneToValue: (lane: number) => number,
    entities: Entity[],
    entity: EntityOfType<T>,
    startLane: number,
    lane: number,
    beat: number,
): EventObject => ({
    beat,
    value: entities.some((entity) => entity.type !== type)
        ? entity.value
        : clamp(entity.value + align(laneToValue(lane), 10) - align(laneToValue(startLane), 10)),
    ease: entity.ease,
})

const toMovedRotateEventObject = (
    entities: Entity[],
    entity: RotateEventJointEntity,
    startLane: number,
    lane: number,
    beat: number,
): EventObject => {
    const division = entities.some(
        ({ type }) =>
            type === 'tapNote' || type === 'singleHoldNoteJoint' || type === 'doubleHoldNoteJoint',
    )
        ? 1
        : 2

    return {
        beat,
        value: entity.value - align(lane, division) + align(startLane, division),
        ease: entity.ease,
    }
}

const toMovedTapNoteObject = (
    entity: TapNoteEntity,
    startLane: number,
    lane: number,
    beat: number,
): TapNoteObject => ({
    beat,
    color: entity.color,
    lane: mod(entity.lane + align(lane) - align(startLane), 8),
})

const toMovedSingleHoldNoteJointObject = (
    entity: SingleHoldNoteJointEntity,
    startLane: number,
    lane: number,
    beat: number,
): SingleHoldNoteJointObject => ({
    beat,
    color: entity.color,
    lane: mod(entity.lane + align(lane) - align(startLane), 8),
    scaleL: entity.scaleL,
    scaleR: entity.scaleR,
})

const toMovedDoubleHoldNoteJointObject = (
    entities: Entity[],
    entity: DoubleHoldNoteJointEntity,
    startLane: number,
    lane: number,
    beat: number,
    focus: Entity,
): DoubleHoldNoteJointObject => {
    let focusL = Number.NEGATIVE_INFINITY
    let focusR = Number.POSITIVE_INFINITY
    if (
        focus.type === 'doubleHoldNoteJoint' &&
        entities.every((entity) => entity.type === 'doubleHoldNoteJoint')
    ) {
        focusL = Math.min(focus.laneL, focus.laneR)
        focusR = Math.max(focus.laneL, focus.laneR)
    }

    const laneL = Math.min(entity.laneL, entity.laneR)
    const laneR = Math.max(entity.laneL, entity.laneR)

    if (startLane < focusL)
        return {
            beat: entity.beat,
            color: entity.color,
            laneL: mod(laneL + align(lane) - align(startLane), 8),
            laneR,
        }

    if (startLane > focusR)
        return {
            beat: entity.beat,
            color: entity.color,
            laneL,
            laneR: mod(laneR + align(lane) - align(startLane), 8),
        }

    return {
        beat,
        color: entity.color,
        laneL: mod(laneL + align(lane) - align(startLane), 8),
        laneR: mod(laneR + align(lane) - align(startLane), 8),
    }
}

type Create<T extends Entity> = (
    entities: Entity[],
    entity: T,
    startLane: number,
    lane: number,
    beat: number,
    focus: Entity,
) => Entity | undefined

const createValueEntity =
    <T extends ValueEntity>(toEntity: (object: ValueObject) => T): Create<T> =>
    (entities, entity, startLane, lane, beat) =>
        toEntity(toMovedValueObject(entity, beat))

const createEventJointEntity =
    <T extends EventJointEntityType>(
        type: T,
        laneToValue: (lane: number) => number,
        toEntity: (object: EventObject) => EntityOfType<T>,
    ): Create<EntityOfType<T>> =>
    (entities, entity, startLane, lane, beat) =>
        toEntity(toMovedEventObject(type, laneToValue, entities, entity, startLane, lane, beat))

const creates: {
    [T in Entity as T['type']]?: Create<T>
} = {
    bpm: createValueEntity(toBpmEntity),
    timeScale: createValueEntity(toTimeScaleEntity),

    rotateEventJoint: (entities, entity, startLane, lane, beat) =>
        toRotateEventJointEntity(toMovedRotateEventObject(entities, entity, startLane, lane, beat)),
    shiftEventJoint: createEventJointEntity(
        'shiftEventJoint',
        laneToShiftEventValue,
        toShiftEventJointEntity,
    ),
    zoomEventJoint: createEventJointEntity(
        'zoomEventJoint',
        laneToZoomEventValue,
        toZoomEventJointEntity,
    ),

    tapNote: (entities, entity, startLane, lane, beat) =>
        toTapNoteEntity(toMovedTapNoteObject(entity, startLane, lane, beat)),

    singleHoldNoteJoint: (entities, entity, startLane, lane, beat) =>
        toSingleHoldNoteJointEntity(
            entity.id,
            toMovedSingleHoldNoteJointObject(entity, startLane, lane, beat),
        ),
    doubleHoldNoteJoint: (entities, entity, startLane, lane, beat, focus) =>
        toDoubleHoldNoteJointEntity(
            entity.id,
            toMovedDoubleHoldNoteJointObject(entities, entity, startLane, lane, beat, focus),
        ),
}

type Move<T extends Entity> = (
    transaction: Transaction,
    entities: Entity[],
    entity: T,
    startLane: number,
    lane: number,
    beat: number,
    focus: Entity,
) => Entity[] | undefined

const moveValueEntity =
    <T extends ValueEntityType>(
        type: T,
        add: AddMutation<ValueObject>,
        remove: RemoveMutation<EntityOfType<T>>,
    ): Move<EntityOfType<T>> =>
    (transaction, entities, entity, startLane, lane, beat) => {
        const object = toMovedValueObject(entity, beat)

        if (entity.beat) remove(transaction, entity)

        const overlap = getInStoreGrid(transaction.store.grid, type, object.beat)?.find(
            (entity) => entity.beat === object.beat,
        )
        if (overlap) remove(transaction, overlap)

        return add(transaction, object)
    }

const moveEventJointEntity =
    <T extends EventJointEntityType>(
        type: T,
        laneToValue: (lane: number) => number,
        add: AddMutation<EventObject>,
        remove: RemoveMutation<EntityOfType<T>>,
    ): Move<EntityOfType<T>> =>
    (transaction, entities, entity, startLane, lane, beat) => {
        const object = toMovedEventObject(
            type,
            laneToValue,
            entities,
            entity,
            startLane,
            lane,
            beat,
        )

        remove(transaction, entity)

        const overlap = getInStoreGrid(transaction.store.grid, type, object.beat)?.find(
            (entity) => entity.beat === object.beat,
        )
        if (overlap) remove(transaction, overlap)

        return add(transaction, object)
    }

const moves: {
    [T in Entity as T['type']]?: Move<T>
} = {
    bpm: moveValueEntity('bpm', addBpm, removeBpm),
    timeScale: moveValueEntity('timeScale', addTimeScale, removeTimeScale),

    rotateEventJoint: (transaction, entities, entity, startLane, lane, beat) => {
        const object = toMovedRotateEventObject(entities, entity, startLane, lane, beat)

        removeRotateEventJoint(transaction, entity)

        const overlap = getInStoreGrid(
            transaction.store.grid,
            'rotateEventJoint',
            object.beat,
        )?.find((entity) => entity.beat === object.beat)
        if (overlap) removeRotateEventJoint(transaction, overlap)

        return addRotateEventJoint(transaction, object)
    },
    shiftEventJoint: moveEventJointEntity(
        'shiftEventJoint',
        laneToShiftEventValue,
        addShiftEventJoint,
        removeShiftEventJoint,
    ),
    zoomEventJoint: moveEventJointEntity(
        'zoomEventJoint',
        laneToZoomEventValue,
        addZoomEventJoint,
        removeZoomEventJoint,
    ),

    tapNote: (transaction, entities, entity, startLane, lane, beat) => {
        const object = toMovedTapNoteObject(entity, startLane, lane, beat)

        removeTapNote(transaction, entity)

        const overlap = getInStoreGrid(transaction.store.grid, 'tapNote', object.beat)?.find(
            (entity) => entity.beat === object.beat && entity.lane === object.lane,
        )
        if (overlap) removeTapNote(transaction, overlap)

        return addTapNote(transaction, object)
    },

    singleHoldNoteJoint: (transaction, entities, entity, startLane, lane, beat) => {
        const object = toMovedSingleHoldNoteJointObject(entity, startLane, lane, beat)

        removeSingleHoldNoteJoint(transaction, entity)

        const overlap = getInStoreGrid(
            transaction.store.grid,
            'singleHoldNoteJoint',
            object.beat,
        )?.find((joint) => joint.id === entity.id && joint.beat === object.beat)
        if (overlap) removeSingleHoldNoteJoint(transaction, overlap)

        return addSingleHoldNoteJoint(transaction, entity.id, object)
    },
    doubleHoldNoteJoint: (transaction, entities, entity, startLane, lane, beat, focus) => {
        const object = toMovedDoubleHoldNoteJointObject(
            entities,
            entity,
            startLane,
            lane,
            beat,
            focus,
        )

        removeDoubleHoldNoteJoint(transaction, entity)

        const overlap = getInStoreGrid(
            transaction.store.grid,
            'doubleHoldNoteJoint',
            object.beat,
        )?.find((joint) => joint.id === entity.id && joint.beat === object.beat)
        if (overlap) removeDoubleHoldNoteJoint(transaction, overlap)

        return addDoubleHoldNoteJoint(transaction, entity.id, object)
    },
}
