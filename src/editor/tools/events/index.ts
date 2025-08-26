import type { Tool } from '..'
import type { EventObject } from '../../../chart'
import { pushState, replaceState, state } from '../../../history'
import { selectedEntities } from '../../../history/selectedEntities'
import { store } from '../../../history/store'
import { i18n } from '../../../i18n'
import type { Entity, EntityOfType } from '../../../state/entities'
import type { EventJointEntityType } from '../../../state/entities/events/joints'
import type { AddMutation, RemoveMutation } from '../../../state/mutations'
import { getInStoreGrid } from '../../../state/store/grid'
import { createTransaction, type Transaction } from '../../../state/transaction'
import { interpolate } from '../../../utils/interpolate'
import type { Ease } from '../../ease'
import { notify } from '../../notification'
import { focusViewAtBeat, setViewHover, snapYToBeat, view, yToValidBeat } from '../../view'
import { hitEntitiesAtPoint } from '../utils'

export const createEventTool = <T extends EventJointEntityType>(
    objectName: () => string,
    showPropertiesModal: (object: EntityOfType<T>) => Promise<EventObject | undefined>,

    isMatch: (value: number, x: number) => boolean,
    getValue: (beat: number, x: number) => number,
    shiftValue: (value: number, sx: number, x: number) => number,
    getEase: () => Ease | undefined,

    type: T,
    toEntity: (object: EventObject) => EntityOfType<T>,
    addEntity: AddMutation<EventObject>,
    removeEntity: RemoveMutation<EntityOfType<T>>,
): Tool => {
    const getEntityFromSelection = () => {
        if (selectedEntities.value.length !== 1) return

        const [entity] = selectedEntities.value
        if (entity?.type !== type) return

        return entity
    }

    const getPropertiesFromSelection = () => {
        const entity = getEntityFromSelection()

        return {
            ease: getEase() ?? entity?.ease ?? 'linear',
        }
    }

    const find = (beat: number) =>
        getInStoreGrid(store.value.grid, type, beat)?.find((entity) => entity.beat === beat)

    const findNearest = (beat: number, x: number) =>
        getInStoreGrid(store.value.grid, type, beat)?.find(
            (entity) => entity.beat === beat && isMatch(entity.value, x),
        )

    const tryFind = (x: number, y: number): [EntityOfType<T>] | [undefined, number, number] => {
        const [hit] = hitEntitiesAtPoint(x, y)
            .filter((entity): entity is EntityOfType<T> => entity.type === type)
            .sort(
                (a, b) => +selectedEntities.value.includes(b) - +selectedEntities.value.includes(a),
            )
        if (hit) return [hit]

        const beat = yToValidBeat(y)
        const nearest = findNearest(beat, x)
        if (nearest) return [nearest]

        return [undefined, beat, getValue(beat, x)]
    }

    const editMoveOrReplace = (entity: EntityOfType<T>, object: EventObject) => {
        if (entity.beat === object.beat) {
            edit(entity, object)
            return
        }

        const overlap = find(object.beat)
        if (overlap) {
            replace(overlap, object, entity)
        } else {
            move(object, entity)
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

    const add = (object: EventObject) => {
        update(
            () => i18n.value.tools.events.added,
            (transaction) => {
                return addEntity(transaction, object)
            },
        )
    }

    const edit = (entity: EntityOfType<T>, object: EventObject) => {
        update(
            () => i18n.value.tools.events.edited,
            (transaction) => {
                removeEntity(transaction, entity)
                return addEntity(transaction, object)
            },
        )
    }

    const move = (object: EventObject, old: EntityOfType<T>) => {
        update(
            () => i18n.value.tools.events.moved,
            (transaction) => {
                removeEntity(transaction, old)
                return addEntity(transaction, object)
            },
        )
    }

    const replace = (entity: EntityOfType<T>, object: EventObject, old: EntityOfType<T>) => {
        update(
            () => i18n.value.tools.events.replaced,
            (transaction) => {
                removeEntity(transaction, old)
                removeEntity(transaction, entity)
                return addEntity(transaction, object)
            },
        )
    }

    let active:
        | {
              type: 'add'
          }
        | {
              type: 'move'
              entity: EntityOfType<T>
              x: number
          }
        | undefined

    return {
        hover(x, y) {
            const [entity, beat, value] = tryFind(x, y)
            if (entity) {
                view.entities = {
                    hovered: [entity],
                    creating: [],
                }
            } else {
                view.entities = {
                    hovered: [],
                    creating: [
                        toEntity({
                            beat,
                            value,
                            ...getPropertiesFromSelection(),
                        }),
                    ],
                }
            }
        },

        async tap(x, y) {
            const [entity, beat, value] = tryFind(x, y)
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

                editMoveOrReplace(entity, object)
            } else {
                const object: EventObject = {
                    beat,
                    value,
                    ...getPropertiesFromSelection(),
                }

                const overlap = find(object.beat)
                if (overlap) {
                    edit(overlap, object)
                } else {
                    add(object)
                }
                focusViewAtBeat(object.beat)
            }
        },

        dragStart(x, y) {
            const [entity, beat] = tryFind(x, y)
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

                notify(interpolate(() => i18n.value.tools.events.moving, '1', objectName))

                active = {
                    type: 'move',
                    entity,
                    x,
                }
            } else {
                focusViewAtBeat(beat)

                notify(interpolate(() => i18n.value.tools.events.adding, '1', objectName))

                active = {
                    type: 'add',
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
                            toEntity({
                                beat,
                                value: getValue(beat, x),
                                ...getPropertiesFromSelection(),
                            }),
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
                            toEntity({
                                beat,
                                value: shiftValue(active.entity.value, active.x, x),
                                ease: active.entity.ease,
                            }),
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
                    const [entity, beat, value] = tryFind(x, y)
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

                        editMoveOrReplace(entity, object)
                    } else {
                        const object: EventObject = {
                            beat,
                            value,
                            ...getPropertiesFromSelection(),
                        }

                        const overlap = find(object.beat)
                        if (overlap) {
                            edit(overlap, object)
                        } else {
                            add(object)
                        }
                        focusViewAtBeat(object.beat)
                    }
                    break
                }
                case 'move': {
                    editMoveOrReplace(active.entity, {
                        beat: snapYToBeat(y, active.entity.beat),
                        value: shiftValue(active.entity.value, active.x, x),
                        ease: active.entity.ease,
                    })
                    break
                }
            }

            active = undefined
        },
    }
}
