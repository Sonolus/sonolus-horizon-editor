import type { Tool } from '..'
import type { ValueObject } from '../../../chart'
import { pushState, replaceState, state } from '../../../history'
import { selectedEntities } from '../../../history/selectedEntities'
import { store } from '../../../history/store'
import { i18n } from '../../../i18n'
import type { Entity, EntityOfType } from '../../../state/entities'
import type { ValueEntityType } from '../../../state/entities/values'
import type { AddMutation, RemoveMutation } from '../../../state/mutations'
import { getInStoreGrid } from '../../../state/store/grid'
import { createTransaction, type Transaction } from '../../../state/transaction'
import { interpolate } from '../../../utils/interpolate'
import { notify } from '../../notification'
import { focusViewAtBeat, setViewHover, snapYToBeat, view, yToValidBeat } from '../../view'
import { hitEntitiesAtPoint } from '../utils'

export const createValueTool = <T extends ValueEntityType>(
    objectName: () => string,
    showPropertiesModal: (
        object: ValueObject | EntityOfType<T>,
    ) => Promise<ValueObject | undefined>,

    defaultValue: number,

    type: T,
    toEntity: (object: ValueObject) => EntityOfType<T>,
    addEntity: AddMutation<ValueObject>,
    removeEntity: RemoveMutation<EntityOfType<T>>,
): Tool => {
    const find = (beat: number) =>
        getInStoreGrid(store.value.grid, type, beat)?.find((entity) => entity.beat === beat)

    const tryFind = (x: number, y: number): [EntityOfType<T>] | [undefined, number] => {
        const [hit] = hitEntitiesAtPoint(x, y)
            .filter((entity): entity is EntityOfType<T> => entity.type === type)
            .sort(
                (a, b) => +selectedEntities.value.includes(b) - +selectedEntities.value.includes(a),
            )
        if (hit) return [hit]

        const beat = yToValidBeat(y)
        const nearest = find(beat)
        if (nearest) return [nearest]

        return [undefined, beat]
    }

    const editMoveOrReplace = (entity: EntityOfType<T>, object: ValueObject) => {
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

    const add = (object: ValueObject) => {
        update(
            () => i18n.value.tools.values.added,
            (transaction) => {
                return addEntity(transaction, object)
            },
        )
    }

    const edit = (entity: EntityOfType<T>, object: ValueObject) => {
        update(
            () => i18n.value.tools.values.edited,
            (transaction) => {
                removeEntity(transaction, entity)
                return addEntity(transaction, object)
            },
        )
    }

    const move = (object: ValueObject, old: EntityOfType<T>) => {
        update(
            () => i18n.value.tools.values.moved,
            (transaction) => {
                if (old.beat) removeEntity(transaction, old)
                return addEntity(transaction, object)
            },
        )
    }

    const replace = (entity: EntityOfType<T>, object: ValueObject, old: EntityOfType<T>) => {
        update(
            () => i18n.value.tools.values.replaced,
            (transaction) => {
                if (old.beat) removeEntity(transaction, old)
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
          }
        | undefined

    return {
        hover(x, y) {
            const [entity, beat] = tryFind(x, y)
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
                            value: defaultValue,
                        }),
                    ],
                }
            }
        },

        async tap(x, y) {
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

                const object = await showPropertiesModal(entity)
                if (!object) return

                editMoveOrReplace(entity, object)
            } else {
                replaceState({
                    ...state.value,
                    selectedEntities: [],
                })
                view.entities = {
                    hovered: [],
                    creating: [
                        toEntity({
                            beat,
                            value: defaultValue,
                        }),
                    ],
                }
                focusViewAtBeat(beat)

                const object = await showPropertiesModal({
                    beat,
                    value: defaultValue,
                })
                if (!object) return

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

                notify(interpolate(() => i18n.value.tools.values.moving, '1', objectName))

                active = {
                    type: 'move',
                    entity,
                }
            } else {
                focusViewAtBeat(beat)

                notify(interpolate(() => i18n.value.tools.values.adding, '1', objectName))

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
                                value: defaultValue,
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
                                value: active.entity.value,
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

                        const object = await showPropertiesModal(entity)
                        if (!object) return

                        editMoveOrReplace(entity, object)
                    } else {
                        replaceState({
                            ...state.value,
                            selectedEntities: [],
                        })
                        view.entities = {
                            hovered: [],
                            creating: [
                                toEntity({
                                    beat,
                                    value: defaultValue,
                                }),
                            ],
                        }
                        focusViewAtBeat(beat)

                        const object = await showPropertiesModal({
                            beat,
                            value: defaultValue,
                        })
                        if (!object) return

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
                        value: active.entity.value,
                    })
                    break
                }
            }

            active = undefined
        },
    }
}
