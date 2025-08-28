import type { Component } from 'vue'
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
import { notify } from '../../notification'
import { isSidebarVisible } from '../../sidebars'
import {
    focusViewAtBeat,
    setViewHover,
    snapYToBeat,
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
    sidebar: Component,
    showPropertiesModal: (object: EntityOfType<U>) => Promise<T | undefined>,

    getObject: (beat: number, lane: number, joint: EntityOfType<U> | undefined) => T,
    shiftObject: (entity: EntityOfType<U>, beat: number, startLane: number, lane: number) => T,
    addObject: (
        beat: number,
        startLane: number,
        lane: number,
        joint: EntityOfType<U> | undefined,
    ) => T,
    editEntity: (entity: EntityOfType<U>, object: Partial<T>) => T,

    jointType: U,
    isInFindLane: (joint: EntityOfType<U>, lane: number) => boolean,
    toJointEntity: (id: HoldNoteId, object: T) => EntityOfType<U>,
    addJointEntity: (transaction: Transaction, id: HoldNoteId, object: T) => Entity[],
    removeJointEntity: (transaction: Transaction, entity: EntityOfType<U>) => void,
): [
    Tool,
    (entity: EntityOfType<U>, object: Partial<T>) => void,
    (transaction: Transaction, entity: EntityOfType<U>, object: Partial<T>) => Entity[],
] => {
    const isJoint = (entity: Entity): entity is EntityOfType<U> => entity.type === jointType

    const getJointFromSelection = () => {
        if (selectedEntities.value.length !== 1) return

        const [entity] = selectedEntities.value
        if (!entity) return
        if (!isJoint(entity)) return

        return entity
    }

    const find = (beat: number, lane: number) =>
        getInStoreGrid(store.value.grid, jointType, beat)?.find(
            (entity) => entity.beat === beat && isInFindLane(entity, lane),
        )

    const findOverlap = (id: HoldNoteId, beat: number) =>
        getInStoreGrid(store.value.grid, jointType, beat)?.find(
            (entity) => entity.id === id && entity.beat === beat,
        )

    const tryFind = (x: number, y: number): [EntityOfType<U>] | [undefined, number, number] => {
        const [hit] = hitEntitiesAtPoint(x, y)
            .filter(isJoint)
            .sort(
                (a, b) => +selectedEntities.value.includes(b) - +selectedEntities.value.includes(a),
            )
        if (hit) return [hit]

        const lane = xToValidLane(x)
        const beat = yToValidBeat(y)
        const nearest = find(beat, lane)
        if (nearest) return [nearest]

        return [undefined, beat, lane]
    }

    const getSelectedId = () => {
        if (!selectedEntities.value.every(isJoint)) return

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
              type: 'add'
              lane: number
          }
        | {
              type: 'move'
              entity: EntityOfType<U>
              lane: number
          }
        | undefined

    return [
        {
            sidebar,

            hover(x, y) {
                const [entity, beat, lane] = tryFind(x, y)
                if (entity) {
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
                const [entity, beat, lane] = tryFind(x, y)
                if (entity) {
                    if (
                        selectedEntities.value.length === 1 &&
                        selectedEntities.value[0] === entity
                    ) {
                        if (isSidebarVisible.value) return

                        const object = await showPropertiesModal(entity)
                        if (!object) return

                        editMoveOrReplaceJoint(entity, object)
                        focusViewAtBeat(object.beat)
                    } else {
                        replaceState({
                            ...state.value,
                            selectedEntities: [entity],
                        })
                        view.entities = {
                            hovered: [],
                            creating: [],
                        }
                        focusViewAtBeat(entity.beat)

                        notify(
                            interpolate(() => i18n.value.tools.holdNotes.selected, '1', objectName),
                        )
                    }
                } else {
                    const object = getObject(beat, lane, getJointFromSelection())

                    const id = getSelectedId()
                    if (id) {
                        const overlap = findOverlap(id, object.beat)
                        if (overlap) {
                            editJoint(overlap, object)
                        } else {
                            addJoint(id, object)
                        }
                    } else {
                        addJoint(createHoldNoteId(), object)
                    }
                    focusViewAtBeat(beat)
                }
            },

            dragStart(x, y) {
                const [entity, beat, lane] = tryFind(x, y)
                if (entity) {
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
                        type: 'move',
                        entity,
                        lane: xToLane(x),
                    }
                } else {
                    focusViewAtBeat(beat)

                    notify(interpolate(() => i18n.value.tools.holdNotes.adding, '1', objectName))

                    active = {
                        type: 'add',
                        lane,
                    }
                }

                return true
            },

            dragUpdate(x, y) {
                if (!active) return

                setViewHover(x, y)

                switch (active.type) {
                    case 'add': {
                        const beat = yToValidBeat(y)

                        view.entities = {
                            hovered: [],
                            creating: [
                                toJointEntity(
                                    createHoldNoteId(),
                                    addObject(
                                        beat,
                                        active.lane,
                                        xToValidLane(x),
                                        getJointFromSelection(),
                                    ),
                                ),
                            ],
                        }
                        focusViewAtBeat(beat)
                        break
                    }
                    case 'move': {
                        const beat = snapYToBeat(y, active.entity.beat)

                        view.entities = {
                            hovered: [],
                            creating: [
                                toJointEntity(
                                    createHoldNoteId(),
                                    shiftObject(active.entity, beat, active.lane, xToLane(x)),
                                ),
                            ],
                        }
                        focusViewAtBeat(beat)
                        break
                    }
                }
            },

            async dragEnd(x, y) {
                if (!active) return

                switch (active.type) {
                    case 'add': {
                        const [entity, beat, lane] = tryFind(x, y)
                        if (entity) {
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
                            focusViewAtBeat(object.beat)
                        } else {
                            const object = addObject(
                                beat,
                                active.lane,
                                lane,
                                getJointFromSelection(),
                            )

                            const id = getSelectedId()
                            if (id) {
                                const overlap = findOverlap(id, object.beat)
                                if (overlap) {
                                    editJoint(overlap, object)
                                } else {
                                    addJoint(id, object)
                                }
                            } else {
                                addJoint(createHoldNoteId(), object)
                            }
                            focusViewAtBeat(beat)
                        }
                        break
                    }
                    case 'move': {
                        const beat = snapYToBeat(y, active.entity.beat)

                        editMoveOrReplaceJoint(
                            active.entity,
                            shiftObject(active.entity, beat, active.lane, xToLane(x)),
                        )
                        focusViewAtBeat(beat)
                        break
                    }
                }

                active = undefined
            },
        },

        (entity, object) => {
            editMoveOrReplaceJoint(entity, editEntity(entity, object))
        },

        (transaction, entity, object) => {
            removeJointEntity(transaction, entity)
            return addJointEntity(transaction, entity.id, editEntity(entity, object))
        },
    ]
}
