import type { Tool } from '..'
import { pushState, replaceState, state } from '../../../history'
import { selectedEntities } from '../../../history/selectedEntities'
import { i18n } from '../../../i18n'
import type { Entity } from '../../../state/entities'
import { createTransaction, type Transaction } from '../../../state/transaction'
import { interpolate } from '../../../utils/interpolate'
import type { Ease } from '../../ease'
import { notify } from '../../notification'
import type { EditableObject } from '../../sidebars/default'
import { focusViewAtBeat, setViewHover, view, xToLane, yToTime, yToValidBeat } from '../../view'
import { editSelectedRotateEventJoint } from '../events/rotate'
import { editSelectedShiftEventJoint } from '../events/shift'
import { editSelectedZoomEventJoint } from '../events/zoom'
import { editSelectedDoubleHoldNoteJoint } from '../holdNotes/double'
import { editSelectedSingleHoldNoteJoint } from '../holdNotes/single'
import { editSelectedTapNote } from '../tapNote'
import { hitEntitiesAtPoint, hitEntitiesInSelection, modifyEntities, toSelection } from '../utils'
import BrushSidebar from './BrushSidebar.vue'

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
    sidebar: BrushSidebar,

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

const applies: {
    [T in Entity as T['type']]?: (
        transaction: Transaction,
        entity: T,
        object: EditableObject,
    ) => Entity[]
} = {
    rotateEventJoint: editSelectedRotateEventJoint,
    shiftEventJoint: editSelectedShiftEventJoint,
    zoomEventJoint: editSelectedZoomEventJoint,

    tapNote: editSelectedTapNote,

    singleHoldNoteJoint: editSelectedSingleHoldNoteJoint,
    doubleHoldNoteJoint: editSelectedDoubleHoldNoteJoint,
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
        (entity) =>
            applies[entity.type]?.(transaction, entity as never, brushProperties) ?? [entity],
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
