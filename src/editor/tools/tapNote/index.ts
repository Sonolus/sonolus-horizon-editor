import type { Tool } from '..'
import type { TapNoteObject } from '../../../chart'
import { pushState, replaceState, state } from '../../../history'
import { selectedEntities } from '../../../history/selectedEntities'
import { store } from '../../../history/store'
import { i18n } from '../../../i18n'
import { showModal } from '../../../modals'
import type { Entity } from '../../../state/entities'
import { toTapNoteEntity, type TapNoteEntity } from '../../../state/entities/tapNote'
import { addTapNote, removeTapNote } from '../../../state/mutations/tapNote'
import { getInStoreGrid } from '../../../state/store/grid'
import { createTransaction, type Transaction } from '../../../state/transaction'
import { interpolate } from '../../../utils/interpolate'
import { align, mod } from '../../../utils/math'
import { notify } from '../../notification'
import { focusDefaultSidebar, isSidebarVisible } from '../../sidebars'
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
import TapNotePropertiesModal from './TapNotePropertiesModal.vue'
import TapNoteSidebar from './TapNoteSidebar.vue'

export type DefaultTapNoteProperties = {
    color?: number
}

export let defaultTapNoteProperties: DefaultTapNoteProperties = {}

export const setDefaultTapNoteProperties = (properties: DefaultTapNoteProperties) => {
    defaultTapNoteProperties = properties
}

let active:
    | {
          type: 'add'
      }
    | {
          type: 'move'
          entity: TapNoteEntity
          lane: number
      }
    | undefined

export const tapNote: Tool = {
    sidebar: TapNoteSidebar,

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
                    toTapNoteEntity({
                        beat,
                        lane,
                        ...getPropertiesFromSelection(),
                    }),
                ],
            }
        }
    },

    async tap(x, y, modifiers) {
        const [entity, beat, lane] = tryFind(x, y)
        if (entity) {
            if (modifiers.ctrl) {
                const selectedTapNoteEntities: Entity[] = selectedEntities.value.filter(
                    (entity) => entity.type === 'tapNote',
                )

                const targets = selectedTapNoteEntities.includes(entity)
                    ? selectedTapNoteEntities.filter((e) => e !== entity)
                    : [...selectedTapNoteEntities, entity]

                replaceState({
                    ...state.value,
                    selectedEntities: targets,
                })
                view.entities = {
                    hovered: [],
                    creating: [],
                }
                focusViewAtBeat(entity.beat)

                notify(interpolate(() => i18n.value.tools.tapNote.selected, `${targets.length}`))
            } else {
                if (selectedEntities.value.length === 1 && selectedEntities.value[0] === entity) {
                    if (isSidebarVisible.value) {
                        focusDefaultSidebar()
                        return
                    }

                    const object: TapNoteObject | undefined = await showModal(
                        TapNotePropertiesModal,
                        {
                            object: entity,
                        },
                    )
                    if (!object) return

                    editMoveOrReplace(entity, object)
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

                    notify(interpolate(() => i18n.value.tools.tapNote.selected, '1'))
                }
            }
        } else {
            add({
                beat,
                lane,
                ...getPropertiesFromSelection(),
            })
            focusViewAtBeat(beat)
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

            notify(interpolate(() => i18n.value.tools.tapNote.moving, '1'))

            active = {
                type: 'move',
                entity,
                lane: align(xToLane(x)),
            }
        } else {
            focusViewAtBeat(beat)

            notify(interpolate(() => i18n.value.tools.tapNote.adding, '1'))

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
                        toTapNoteEntity({
                            beat,
                            lane: xToValidLane(x),
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
                        toTapNoteEntity({
                            beat,
                            color: active.entity.color,
                            lane: mod(active.entity.lane + align(xToLane(x)) - active.lane, 8),
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

                    const object: TapNoteObject | undefined = await showModal(
                        TapNotePropertiesModal,
                        {
                            object: entity,
                        },
                    )
                    if (!object) return

                    editMoveOrReplace(entity, object)
                    focusViewAtBeat(object.beat)
                } else {
                    add({
                        beat,
                        lane,
                        ...getPropertiesFromSelection(),
                    })
                    focusViewAtBeat(beat)
                }
                break
            }
            case 'move': {
                const beat = snapYToBeat(y, active.entity.beat)

                editMoveOrReplace(active.entity, {
                    beat,
                    color: active.entity.color,
                    lane: mod(active.entity.lane + align(xToLane(x)) - active.lane, 8),
                })
                focusViewAtBeat(beat)
                break
            }
        }

        active = undefined
    },
}

const getTapNoteFromSelection = () => {
    if (selectedEntities.value.length !== 1) return

    const [entity] = selectedEntities.value
    if (entity?.type !== 'tapNote') return

    return entity
}

const getPropertiesFromSelection = () => {
    const tapNote = getTapNoteFromSelection()

    return {
        color: defaultTapNoteProperties.color ?? tapNote?.color ?? 0,
    }
}

const find = (beat: number, lane: number) =>
    getInStoreGrid(store.value.grid, 'tapNote', beat)?.find(
        (entity) => entity.beat === beat && entity.lane === lane,
    )

const tryFind = (x: number, y: number): [TapNoteEntity] | [undefined, number, number] => {
    const [hit] = hitEntitiesAtPoint('tapNote', x, y).sort(
        (a, b) => +selectedEntities.value.includes(b) - +selectedEntities.value.includes(a),
    )
    if (hit) return [hit]

    const lane = xToValidLane(x)
    const beat = yToValidBeat(y)
    const nearest = find(beat, lane)
    if (nearest) return [nearest]

    return [undefined, beat, lane]
}

export const editTapNote = (entity: TapNoteEntity, object: Partial<TapNoteObject>) => {
    editMoveOrReplace(entity, {
        beat: object.beat ?? entity.beat,
        color: object.color ?? entity.color,
        lane: object.lane ?? entity.lane,
    })
}

export const editSelectedTapNote = (
    transaction: Transaction,
    entity: TapNoteEntity,
    object: Partial<TapNoteObject>,
) => {
    removeTapNote(transaction, entity)
    return addTapNote(transaction, {
        beat: object.beat ?? entity.beat,
        color: object.color ?? entity.color,
        lane: object.lane ?? entity.lane,
    })
}

const editMoveOrReplace = (entity: TapNoteEntity, object: TapNoteObject) => {
    if (entity.beat === object.beat && entity.lane === object.lane) {
        edit(entity, object)
        return
    }

    const overlap = find(object.beat, object.lane)
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

    pushState(interpolate(message, `${selectedEntities.length}`), {
        ...transaction.commit(),
        selectedEntities,
    })
    view.entities = {
        hovered: [],
        creating: [],
    }

    notify(interpolate(message, `${selectedEntities.length}`))
}

const add = (object: TapNoteObject) => {
    update(
        () => i18n.value.tools.tapNote.added,
        (transaction) => {
            return addTapNote(transaction, object)
        },
    )
}

const edit = (entity: TapNoteEntity, object: TapNoteObject) => {
    update(
        () => i18n.value.tools.tapNote.edited,
        (transaction) => {
            removeTapNote(transaction, entity)
            return addTapNote(transaction, object)
        },
    )
}

const move = (object: TapNoteObject, old: TapNoteEntity) => {
    update(
        () => i18n.value.tools.tapNote.moved,
        (transaction) => {
            removeTapNote(transaction, old)
            return addTapNote(transaction, object)
        },
    )
}

const replace = (entity: TapNoteEntity, object: TapNoteObject, old: TapNoteEntity) => {
    update(
        () => i18n.value.tools.tapNote.replaced,
        (transaction) => {
            removeTapNote(transaction, old)
            removeTapNote(transaction, entity)
            return addTapNote(transaction, object)
        },
    )
}
