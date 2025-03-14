import type { AddMutation, RemoveMutation } from '..'
import type { ValueObject } from '../../../chart'
import { addToOrdered, removeFromOrdered } from '../../../utils/ordered'
import { toBpmEntity, type BpmEntity } from '../../entities/values/bpm'
import { toBpmIntegral } from '../../integrals/bpms'
import { addToStoreGrid, removeFromStoreGrid } from '../../store/grid'

export const addBpm: AddMutation<ValueObject> = ({ store, bpms }, object) => {
    addToOrdered(bpms, 'x', toBpmIntegral(object))

    const entity = toBpmEntity(object)
    addToStoreGrid(store.grid, entity, entity.beat)

    return [entity]
}

export const removeBpm: RemoveMutation<BpmEntity> = ({ store, bpms }, entity) => {
    removeFromOrdered(bpms, 'x', entity.beat)

    removeFromStoreGrid(store.grid, entity, entity.beat)
}
