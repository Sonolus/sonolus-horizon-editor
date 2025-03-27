import type { Tool } from '..'
import type { HoldNoteJointObject } from '../../../chart'
import { pushState, replaceState, state } from '../../../history'
import { selectedEntities } from '../../../history/selectedEntities'
import { store } from '../../../history/store'
import { i18n } from '../../../i18n'
import type { Entity, EntityOfType } from '../../../state/entities'
import { type HoldNoteId, createHoldNoteId } from '../../../state/entities/holdNotes'
import type { HoldNoteJointEntityType } from '../../../state/entities/holdNotes/joints'
import { getInStoreGrid } from '../../../state/store/grid'
import { type Transaction, createTransaction } from '../../../state/transaction'
import { interpolate } from '../../../utils/interpolate'
import { align } from '../../../utils/math'
import { notify } from '../../notification'
import {
    focusViewAtBeat,
    setViewHover,
    view,
    xToLane,
    xToValidLane,
    yToValidBeat,
} from '../../view'
import { hitEntitiesAtPoint } from '../utils'

export const createHoldNoteTool = <
    T extends HoldNoteJointObject,
    U extends HoldNoteJointEntityType,
>(
    objectName: () => string,
    showPropertiesModal: (object: EntityOfType<U>) => Promise<T | undefined>,

    getObject: (beat: number, lane: number, joint: EntityOfType<U> | undefined) => T,
    shiftObject: (entity: EntityOfType<U>, beat: number, laneOffset: number) => T,

    jointType: U,
    isInFindLane: (joint: EntityOfType<U>, lane: number) => boolean,
    toJointEntity: (id: HoldNoteId, object: T) => EntityOfType<U>,
    addJointEntity: (transaction: Transaction, id: HoldNoteId, object: T) => Entity[],
    removeJointEntity: (transaction: Transaction, entity: EntityOfType<U>) => void,
): Tool => {
    const getJointFromSelection = () => {
        if (selectedEntities.value.length !== 1) return

        const [entity] = selectedEntities.value
        if (entity?.type !== jointType) return

        return entity as EntityOfType<U>
    }

    const find = (beat: number, lane: number) =>
        getInStoreGrid(store.value.grid, jointType, beat)?.find(
            (entity) => entity.beat === beat && isInFindLane(entity, lane),
        )

    const findOverlap = (id: HoldNoteId, beat: number) =>
        getInStoreGrid(store.value.grid, jointType, beat)?.find(
            (entity) => entity.id === id && entity.beat === beat,
        )

    const tryFind = (
        x: number,
        y: number,
    ): [true, EntityOfType<U>] | [false, undefined, number, number] => {
        const [hit] = hitEntitiesAtPoint(x, y)
            .filter((entity): entity is EntityOfType<U> => entity.type === jointType)
            .sort(
                (a, b) => +selectedEntities.value.includes(b) - +selectedEntities.value.includes(a),
            )
        if (hit) return [true, hit]

        const lane = xToValidLane(x)
        const beat = yToValidBeat(y)
        const nearest = find(beat, lane)
        if (nearest) return [true, nearest]

        return [false, undefined, beat, lane]
    }

    const getSelectedId = () => {
        if (
            !selectedEntities.value.every(
                (entity): entity is EntityOfType<U> => entity.type === jointType,
            )
        )
            return

        const [entity] = selectedEntities.value
        if (!entity) return

        if (!selectedEntities.value.every(({ id }) => id === entity.id)) return

        return entity.id
    }

    const editMoveOrReplaceJoint = (entity: EntityOfType<U>, object: T) => {
        if (entity.beat === object.beat) {
            editJoint(entity, object)
            return
        }

        const overlap = findOverlap(entity.id, object.beat)
        if (overlap) {
            replaceJoint(overlap, object, entity)
        } else {
            moveJoint(object, entity)
        }
        focusViewAtBeat(object.beat)
    }

    const update = (message: () => string, action: (transaction: Transaction) => Entity[]) => {
        const transaction = createTransaction(state.value)

        const selectedEntities = action(transaction)

        pushState(interpolate(message, `${selectedEntities.length}`, objectName), {
            ...transaction.commit(),
            selectedEntities,
        })
        view.entities = {
            hovered: [],
            creating: [],
        }

        notify(interpolate(message, `${selectedEntities.length}`, objectName))
    }

    const addJoint = (id: HoldNoteId, object: T) => {
        update(
            () => i18n.value.tools.holdNotes.added,
            (transaction) => {
                return addJointEntity(transaction, id, object)
            },
        )
    }

    const editJoint = (entity: EntityOfType<U>, object: T) => {
        update(
            () => i18n.value.tools.holdNotes.edited,
            (transaction) => {
                removeJointEntity(transaction, entity)
                return addJointEntity(transaction, entity.id, object)
            },
        )
    }

    const moveJoint = (object: T, old: EntityOfType<U>) => {
        update(
            () => i18n.value.tools.holdNotes.moved,
            (transaction) => {
                removeJointEntity(transaction, old)
                return addJointEntity(transaction, old.id, object)
            },
        )
    }

    const replaceJoint = (entity: EntityOfType<U>, object: T, old: EntityOfType<U>) => {
        update(
            () => i18n.value.tools.holdNotes.replaced,
            (transaction) => {
                removeJointEntity(transaction, old)
                removeJointEntity(transaction, entity)
                return addJointEntity(transaction, entity.id, object)
            },
        )
    }

    let active:
        | {
              entity: EntityOfType<U>
              lane: number
          }
        | undefined

    return {
        hover(x, y) {
            const [result, entity, beat, lane] = tryFind(x, y)
            if (result) {
                view.entities = {
                    hovered: [entity],
                    creating: [],
                }
            } else {
                view.entities = {
                    hovered: [],
                    creating: [
                        toJointEntity(
                            createHoldNoteId(),
                            getObject(beat, lane, getJointFromSelection()),
                        ),
                    ],
                }
            }
        },

        async tap(x, y) {
            const [result, entity, beat, lane] = tryFind(x, y)
            if (result) {
                replaceState({
                    ...state.value,
                    selectedEntities: [entity],
                })
                view.entities = {
                    hovered: [],
                    creating: [],
                }
                focusViewAtBeat(entity.beat)

                const object = await showPropertiesModal(entity)
                if (!object) return

                editMoveOrReplaceJoint(entity, object)
            } else {
                const id = getSelectedId()
                if (id) {
                    const object = getObject(
                        yToValidBeat(y),
                        xToValidLane(x),
                        getJointFromSelection(),
                    )

                    const overlap = findOverlap(id, object.beat)
                    if (overlap) {
                        editJoint(overlap, object)
                    } else {
                        addJoint(id, object)
                    }
                } else {
                    addJoint(createHoldNoteId(), getObject(beat, lane, getJointFromSelection()))
                    focusViewAtBeat(beat)
                }
            }
        },

        dragStart(x, y) {
            const [, entity] = tryFind(x, y)
            if (!entity) return false

            replaceState({
                ...state.value,
                selectedEntities: [entity],
            })
            view.entities = {
                hovered: [],
                creating: [],
            }
            focusViewAtBeat(entity.beat)

            notify(interpolate(() => i18n.value.tools.holdNotes.moving, '1', objectName))

            active = {
                entity,
                lane: align(xToLane(x)),
            }
            return true
        },

        dragUpdate(x, y) {
            if (!active) return

            setViewHover(x, y)

            view.entities = {
                hovered: [],
                creating: [
                    toJointEntity(
                        createHoldNoteId(),
                        shiftObject(
                            active.entity,
                            yToValidBeat(y),
                            align(xToLane(x)) - active.lane,
                        ),
                    ),
                ],
            }
        },

        dragEnd(x, y) {
            if (!active) return

            editMoveOrReplaceJoint(
                active.entity,
                shiftObject(active.entity, yToValidBeat(y), align(xToLane(x)) - active.lane),
            )

            active = undefined
        },
    }
}
