import type { Tool } from '.'
import type {
    DoubleHoldNoteJointObject,
    EventObject,
    SingleHoldNoteJointObject,
    TapNoteObject,
    ValueObject,
} from '../../chart'
import { parseChart } from '../../chart/parse'
import { parseClipboardData } from '../../clipboardData/parse'
import { pushState, state } from '../../history'
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
import { createHoldNoteId } from '../../state/entities/holdNotes'
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
import { addDoubleHoldNoteJoint } from '../../state/mutations/holdNotes/double'
import { addSingleHoldNoteJoint } from '../../state/mutations/holdNotes/single'
import { addTapNote, removeTapNote } from '../../state/mutations/tapNote'
import { addBpm, removeBpm } from '../../state/mutations/values/bpm'
import { addTimeScale, removeTimeScale } from '../../state/mutations/values/timeScale'
import { getInStoreGrid } from '../../state/store/grid'
import { createTransaction, type Transaction } from '../../state/transaction'
import { interpolate } from '../../utils/interpolate'
import { align, clamp, mod } from '../../utils/math'
import { timeout } from '../../utils/promise'
import { notify } from '../notification'
import { view, xToLane, yToBeatOffset } from '../view'

let text: string | undefined
let data:
    | {
          lane: number
          beat: number
          entities: Entity[]
      }
    | undefined

export const paste: Tool = {
    async hover(x, y) {
        await updateClipboard(false)
        if (!data?.entities.length) return

        const lane = xToLane(x)
        const beatOffset = yToBeatOffset(y, data.beat)

        const creating: Entity[] = []
        for (const entity of data.entities) {
            const beat = entity.beat + beatOffset
            if (beat < 0) continue

            const result = creates[entity.type]?.(
                data.entities,
                entity as never,
                data.lane,
                lane,
                beat,
            )
            if (!result) continue

            creating.push(result)
        }

        view.entities = {
            hovered: [],
            creating,
        }
    },

    async tap(x, y) {
        await updateClipboard(true)
        if (!data?.entities.length) return

        const transaction = createTransaction(state.value)

        const lane = xToLane(x)
        const beatOffset = yToBeatOffset(y, data.beat)

        const selectedEntities: Entity[] = []
        for (const entity of data.entities) {
            const beat = entity.beat + beatOffset

            const result = pastes[entity.type]?.(
                transaction,
                data.entities,
                entity as never,
                data.lane,
                lane,
                beat,
            )
            if (!result) continue

            selectedEntities.push(...result)
        }

        pushState(
            interpolate(() => i18n.value.tools.paste.pasted, `${selectedEntities.length}`),
            {
                ...transaction.commit(),
                selectedEntities,
            },
        )
        view.entities = {
            hovered: [],
            creating: [],
        }

        notify(interpolate(() => i18n.value.tools.paste.pasted, `${selectedEntities.length}`))
    },
}

const updateClipboard = async (force: boolean) => {
    const newText = await getText()
    if (!force && text === newText) return

    text = newText
    data = getData(text)
}

const getText = async () => {
    try {
        return await Promise.race([navigator.clipboard.readText(), timeout(50)])
    } catch {
        return
    }
}

const getData = (text: string | undefined) => {
    try {
        if (!text) return

        const clipboardData = parseClipboardData(JSON.parse(text))
        const chart = parseChart(clipboardData.entities)

        return {
            lane: clipboardData.lane,
            beat: clipboardData.beat,
            entities: [
                ...chart.bpms.map(toBpmEntity),
                ...chart.timeScales.map(toTimeScaleEntity),

                ...chart.rotateEvents.map(toRotateEventJointEntity),
                ...chart.shiftEvents.map(toShiftEventJointEntity),
                ...chart.zoomEvents.map(toZoomEventJointEntity),

                ...chart.tapNotes.map(toTapNoteEntity),

                ...chart.singleHoldNotes.flatMap((objects) => {
                    const id = createHoldNoteId()

                    return objects.map((object) => toSingleHoldNoteJointEntity(id, object))
                }),
                ...chart.doubleHoldNotes.flatMap((objects) => {
                    const id = createHoldNoteId()

                    return objects.map((object) => toDoubleHoldNoteJointEntity(id, object))
                }),
            ],
        }
    } catch {
        return
    }
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
    entity: DoubleHoldNoteJointEntity,
    startLane: number,
    lane: number,
    beat: number,
): DoubleHoldNoteJointObject => ({
    beat,
    color: entity.color,
    laneL: mod(entity.laneL + align(lane) - align(startLane), 8),
    laneR: mod(entity.laneR + align(lane) - align(startLane), 8),
})

type Create<T extends Entity> = (
    entities: Entity[],
    entity: T,
    startLane: number,
    lane: number,
    beat: number,
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
    doubleHoldNoteJoint: (entities, entity, startLane, lane, beat) =>
        toDoubleHoldNoteJointEntity(
            entity.id,
            toMovedDoubleHoldNoteJointObject(entity, startLane, lane, beat),
        ),
}

type Paste<T extends Entity> = (
    transaction: Transaction,
    entities: Entity[],
    entity: T,
    startLane: number,
    lane: number,
    beat: number,
) => Entity[] | undefined

const moveValueEntity =
    <T extends ValueEntityType>(
        type: T,
        add: AddMutation<ValueObject>,
        remove: RemoveMutation<EntityOfType<T>>,
    ): Paste<EntityOfType<T>> =>
    (transaction, entities, entity, startLane, lane, beat) => {
        const object = toMovedValueObject(entity, beat)

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
    ): Paste<EntityOfType<T>> =>
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

        const overlap = getInStoreGrid(transaction.store.grid, type, object.beat)?.find(
            (entity) => entity.beat === object.beat,
        )
        if (overlap) remove(transaction, overlap)

        return add(transaction, object)
    }

const pastes: {
    [T in Entity as T['type']]?: Paste<T>
} = {
    bpm: moveValueEntity('bpm', addBpm, removeBpm),
    timeScale: moveValueEntity('timeScale', addTimeScale, removeTimeScale),

    rotateEventJoint: (transaction, entities, entity, startLane, lane, beat) => {
        const object = toMovedRotateEventObject(entities, entity, startLane, lane, beat)

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

        const overlap = getInStoreGrid(transaction.store.grid, 'tapNote', object.beat)?.find(
            (entity) => entity.beat === object.beat && entity.lane === object.lane,
        )
        if (overlap) removeTapNote(transaction, overlap)

        return addTapNote(transaction, object)
    },

    singleHoldNoteJoint: (transaction, entities, entity, startLane, lane, beat) => {
        const object = toMovedSingleHoldNoteJointObject(entity, startLane, lane, beat)

        return addSingleHoldNoteJoint(transaction, entity.id, object)
    },
    doubleHoldNoteJoint: (transaction, entities, entity, startLane, lane, beat) => {
        const object = toMovedDoubleHoldNoteJointObject(entity, startLane, lane, beat)

        return addDoubleHoldNoteJoint(transaction, entity.id, object)
    },
}
