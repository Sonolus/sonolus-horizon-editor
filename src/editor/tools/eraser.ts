import type { Tool } from '.'
import { pushState, replaceState, state } from '../../history'
import { selectedEntities } from '../../history/selectedEntities'
import { i18n } from '../../i18n'
import type { Entity } from '../../state/entities'
import type { RemoveMutation } from '../../state/mutations'
import { removeRotateEventJoint } from '../../state/mutations/events/rotate'
import { removeShiftEventJoint } from '../../state/mutations/events/shift'
import { removeZoomEventJoint } from '../../state/mutations/events/zoom'
import { removeDoubleHoldNoteJoint } from '../../state/mutations/holdNotes/double'
import { removeSingleHoldNoteJoint } from '../../state/mutations/holdNotes/single'
import { removeTapNote } from '../../state/mutations/tapNote'
import { removeBpm } from '../../state/mutations/values/bpm'
import { removeTimeScale } from '../../state/mutations/values/timeScale'
import { createTransaction } from '../../state/transaction'
import { interpolate } from '../../utils/interpolate'
import { notify } from '../notification'
import { focusViewAtBeat, setViewHover, view, xToLane, yToTime, yToValidBeat } from '../view'
import { hitEntitiesAtPoint, hitEntitiesInSelection, modifyEntities, toSelection } from './utils'

let active:
    | {
          lane: number
          time: number
          count: number
      }
    | undefined

export const eraser: Tool = {
    hover(x, y, modifiers) {
        const entities = hitEntitiesAtPoint(x, y)

        view.entities = {
            hovered: modifyEntities(
                entities.some((entity) => selectedEntities.value.includes(entity))
                    ? selectedEntities.value
                    : entities.filter(canRemove).slice(0, 1),
                modifiers,
            ),
            creating: [],
        }
    },

    tap(x, y, modifiers) {
        const entities = hitEntitiesAtPoint(x, y)

        if (entities.some((entity) => selectedEntities.value.includes(entity))) {
            focusViewAtBeat(yToValidBeat(y))
            remove(modifyEntities(selectedEntities.value, modifiers))
        } else {
            const [entity] = entities.filter(canRemove)
            if (entity) {
                focusViewAtBeat(entity.beat)
                remove(modifyEntities([entity], modifiers))
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
                if (selectedLength) notify(() => i18n.value.tools.eraser.deselected)
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
        const targets = modifyEntities(
            hitEntitiesInSelection(selection).filter(canRemove),
            modifiers,
        )

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

        notify(interpolate(() => i18n.value.tools.eraser.erasing, `${targets.length}`))
    },

    dragEnd(x, y, modifiers) {
        if (!active) return

        const selection = toSelection(active.lane, active.time, x, y)

        view.selection = undefined

        remove(modifyEntities(hitEntitiesInSelection(selection), modifiers))

        active = undefined
    },
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

const canRemove = (entity: Entity) => canRemoves[entity.type]?.(entity as never) ?? true

const remove = (entities: Entity[]) => {
    entities = entities.filter(canRemove)
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

    for (const entity of entities) {
        removes[entity.type]?.(transaction, entity as never)
    }

    pushState(
        interpolate(() => i18n.value.tools.eraser.erased, `${entities.length}`),
        {
            ...transaction.commit(),
            selectedEntities: [],
        },
    )
    view.entities = {
        hovered: [],
        creating: [],
    }

    notify(interpolate(() => i18n.value.tools.eraser.erased, `${entities.length}`))
}
