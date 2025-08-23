import type { Tool } from '.'
import type { EventObject } from '../../chart'
import { pushState, replaceState, state } from '../../history'
import { selectedEntities } from '../../history/selectedEntities'
import { i18n } from '../../i18n'
import type { Entity } from '../../state/entities'
import type { EventJointEntity } from '../../state/entities/events/joints'
import type { DoubleHoldNoteJointEntity } from '../../state/entities/holdNotes/joints/double'
import type { SingleHoldNoteJointEntity } from '../../state/entities/holdNotes/joints/single'
import type { TapNoteEntity } from '../../state/entities/tapNote'
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
import { createTransaction, type Transaction } from '../../state/transaction'
import { interpolate } from '../../utils/interpolate'
import type { Ease } from '../ease'
import { notify } from '../notification'
import { focusViewAtBeat, setViewHover, view, xToLane, yToTime, yToValidBeat } from '../view'
import { hitEntitiesAtPoint, hitEntitiesInSelection, modifyEntities, toSelection } from './utils'

export type BrushProperties = {
    color?: number
    scaleL?: number
    scaleR?: number
    ease?: Ease
}

export let brushProperties: BrushProperties = {}

export const setBrushProperties = (properties: BrushProperties) => {
    brushProperties = properties
}

let active:
    | {
          lane: number
          time: number
          count: number
      }
    | undefined

export const brush: Tool = {
    hover(x, y, modifiers) {
        const entities = modifyEntities(hitEntitiesAtPoint(x, y), modifiers)

        view.entities = {
            hovered: entities,
            creating: [],
        }
    },

    tap(x, y, modifiers) {
        const entities = hitEntitiesAtPoint(x, y)

        if (entities.some((entity) => selectedEntities.value.includes(entity))) {
            apply(modifyEntities(selectedEntities.value, modifiers))
            focusViewAtBeat(yToValidBeat(y))
        } else {
            const [entity] = entities
            if (entity) {
                apply(modifyEntities(entities, modifiers))
                focusViewAtBeat(entity.beat)
            } else {
                const selectedLength = selectedEntities.value.length

                replaceState({
                    ...state.value,
                    selectedEntities: [],
                })
                view.entities = {
                    hovered: [],
                    creating: [],
                }

                focusViewAtBeat(yToValidBeat(y))
                if (selectedLength) notify(() => i18n.value.tools.brush.deselected)
            }
        }
    },

    dragStart(x, y) {
        active = {
            lane: xToLane(x),
            time: yToTime(y),
            count: -1,
        }

        return true
    },

    dragUpdate(x, y, modifiers) {
        if (!active) return

        setViewHover(x, y)

        const selection = toSelection(active.lane, active.time, x, y)
        const targets = modifyEntities(hitEntitiesInSelection(selection), modifiers)

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

        notify(interpolate(() => i18n.value.tools.brush.brushing, `${targets.length}`))
    },

    dragEnd(x, y, modifiers) {
        if (!active) return

        const selection = toSelection(active.lane, active.time, x, y)

        view.selection = undefined

        apply(modifyEntities(hitEntitiesInSelection(selection), modifiers))

        active = undefined
    },
}

type Apply<T> = (transaction: Transaction, entity: T) => Entity[] | undefined

const applyEventJointEntity =
    <T extends EventJointEntity>(
        add: AddMutation<EventObject>,
        remove: RemoveMutation<T>,
    ): Apply<T> =>
    (transaction, entity) => {
        const ease = brushProperties.ease ?? entity.ease
        if (entity.ease === ease) return

        remove(transaction, entity)
        return add(transaction, {
            beat: entity.beat,
            value: entity.value,
            ease,
        })
    }

const applyTapNote: Apply<TapNoteEntity> = (transaction, entity) => {
    const color = brushProperties.color ?? entity.color
    if (entity.color === color) return

    removeTapNote(transaction, entity)
    return addTapNote(transaction, {
        beat: entity.beat,
        color,
        lane: entity.lane,
    })
}

const applySingleHoldNoteJoint: Apply<SingleHoldNoteJointEntity> = (transaction, entity) => {
    const color = brushProperties.color ?? entity.color
    const scaleL = brushProperties.scaleL ?? entity.scaleL
    const scaleR = brushProperties.scaleR ?? entity.scaleR
    if (entity.color === color && entity.scaleL === scaleL && entity.scaleR === scaleR) return

    removeSingleHoldNoteJoint(transaction, entity)
    return addSingleHoldNoteJoint(transaction, entity.id, {
        beat: entity.beat,
        color,
        lane: entity.lane,
        scaleL,
        scaleR,
    })
}

const applyDoubleHoldNoteJoint: Apply<DoubleHoldNoteJointEntity> = (transaction, entity) => {
    const color = brushProperties.color ?? entity.color
    if (entity.color === color) return

    removeDoubleHoldNoteJoint(transaction, entity)
    return addDoubleHoldNoteJoint(transaction, entity.id, {
        beat: entity.beat,
        color,
        laneL: entity.laneL,
        laneR: entity.laneR,
    })
}

const applies: {
    [T in Entity as T['type']]?: Apply<T>
} = {
    rotateEventJoint: applyEventJointEntity(addRotateEventJoint, removeRotateEventJoint),
    shiftEventJoint: applyEventJointEntity(addShiftEventJoint, removeShiftEventJoint),
    zoomEventJoint: applyEventJointEntity(addZoomEventJoint, removeZoomEventJoint),

    tapNote: applyTapNote,

    singleHoldNoteJoint: applySingleHoldNoteJoint,
    doubleHoldNoteJoint: applyDoubleHoldNoteJoint,
}

const apply = (entities: Entity[]) => {
    if (!entities.length) {
        replaceState({
            ...state.value,
            selectedEntities: [],
        })
        view.entities = {
            hovered: [],
            creating: [],
        }
        return
    }

    const transaction = createTransaction(state.value)

    const selectedEntities = entities.flatMap(
        (entity) => applies[entity.type]?.(transaction, entity as never) ?? [entity],
    )

    pushState(
        interpolate(() => i18n.value.tools.brush.brushed, `${entities.length}`),
        {
            ...transaction.commit(),
            selectedEntities,
        },
    )
    view.entities = {
        hovered: [],
        creating: [],
    }

    notify(interpolate(() => i18n.value.tools.brush.brushed, `${entities.length}`))
}
