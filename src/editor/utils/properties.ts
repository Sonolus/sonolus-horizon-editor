import { computed } from 'vue'
import { selectedEntities } from '../../history/selectedEntities'
import type { Entity, EntityType } from '../../state/entities'
import { entries } from '../../utils/object'
import { editSelectedEditableEntities, type EditableObject } from '../sidebars/default'

export const useProperties =
    <T>(get: () => T, set: (properties: T) => void) =>
    <K extends keyof T>(key: K) =>
        computed({
            get: () => get()[key],
            set: (value) => {
                set({ ...get(), [key]: value })
            },
        })

export const useSelectedEntitiesProperties = <T extends Entity>(
    filter: (entity: Entity) => entity is T,
) => {
    const entities = computed(() => selectedEntities.value.filter(filter))

    const state = computed(() => {
        const model: Partial<T & EditableObject> = {}
        const types: Partial<Record<EntityType, boolean>> = {}

        for (const entity of entities.value) {
            aggregate(model, entity)

            types[entity.type] = true
        }

        return {
            model,
            types,
        }
    })

    return {
        entities,
        types: computed(() => state.value.types),
        createModel: <K extends DistributedKeyOf<T> & keyof EditableObject>(key: K) =>
            computed({
                get: () => state.value.model[key],
                set: (value) => {
                    if (value === undefined) return

                    editSelectedEditableEntities({ [key]: value })
                },
            }),
    }
}

type DistributedKeyOf<T> = T extends T ? keyof T : never

const aggregate = <T extends object>(aggregate: Partial<T>, object: T) => {
    for (const [key, value] of entries(object)) {
        if (key in aggregate) {
            if (aggregate[key] === undefined) continue

            if (aggregate[key] !== value) {
                aggregate[key] = undefined
            }
        } else {
            aggregate[key] = value
        }
    }
}
