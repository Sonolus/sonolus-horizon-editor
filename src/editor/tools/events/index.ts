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
import { notify } from '../../notification'
import { focusViewAtBeat, setViewHover, view, yToValidBeat } from '../../view'
import { hitEntitiesAtPoint } from '../utils'

export const createEventTool = <T extends EventJointEntityType>(
    objectName: () => string,
    showPropertiesModal: (object: EntityOfType<T>) => Promise<EventObject | undefined>,

    isMatch: (value: number, x: number) => boolean,
    getValue: (beat: number, x: number) => number,
    shiftValue: (value: number, sx: number, x: number) => number,

    type: T,
    toEntity: (object: EventObject) => EntityOfType<T>,
    addEntity: AddMutation<EventObject>,
    removeEntity: RemoveMutation<EntityOfType<T>>,
): Tool => {
    const getPropertiesFromSelection = () => {
        if (selectedEntities.value.length !== 1) return

        const [entity] = selectedEntities.value
        if (entity?.type !== type) return

        return {
            ease: entity.ease,
        }
    }

    const find = (beat: number) =>
        getInStoreGrid(store.value.grid, type, beat)?.find((entity) => entity.beat === beat)

    const findNearest = (beat: number, x: number) =>
        getInStoreGrid(store.value.grid, type, beat)?.find(
            (entity) => entity.beat === beat && isMatch(entity.value, x),
        )

    const tryFind = (
        x: number,
        y: number,
    ): [true, EntityOfType<T>] | [false, undefined, number, number] => {
        const [hit] = hitEntitiesAtPoint(x, y)
            .filter((entity): entity is EntityOfType<T> => entity.type === type)
            .sort(
                (a, b) => +selectedEntities.value.includes(b) - +selectedEntities.value.includes(a),
            )
        if (hit) return [true, hit]

        const beat = yToValidBeat(y)
        const nearest = findNearest(beat, x)
        if (nearest) return [true, nearest]

        return [false, undefined, beat, getValue(beat, x)]
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
              entity: EntityOfType<T>
              x: number
          }
        | undefined

    return {
        hover(x, y) {
            const [result, entity, beat, value] = tryFind(x, y)
            if (result) {
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
                            ease: 'linear',
                            ...getPropertiesFromSelection(),
                        }),
                    ],
                }
            }
        },

        async tap(x, y) {
            const [result, entity, beat, value] = tryFind(x, y)
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

                editMoveOrReplace(entity, object)
            } else {
                const object: EventObject = {
                    beat,
                    value,
                    ease: 'linear',
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

            notify(interpolate(() => i18n.value.tools.events.moving, '1', objectName))

            active = {
                entity,
                x,
            }
            return true
        },

        dragUpdate(x, y) {
            if (!active) return

            setViewHover(x, y)

            view.entities = {
                hovered: [],
                creating: [
                    toEntity({
                        beat: yToValidBeat(y),
                        value: shiftValue(active.entity.value, active.x, x),
                        ease: active.entity.ease,
                    }),
                ],
            }
        },

        dragEnd(x, y) {
            if (!active) return

            editMoveOrReplace(active.entity, {
                beat: yToValidBeat(y),
                value: shiftValue(active.entity.value, active.x, x),
                ease: active.entity.ease,
            })

            active = undefined
        },
    }
}
