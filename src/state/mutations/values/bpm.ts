import { addValue } from '.'
import type { AddMutation, RemoveMutation } from '..'
import type { ValueObject } from '../../../chart'
import { removeFromOrdered } from '../../../utils/ordered'
import { toBpmEntity, type BpmEntity } from '../../entities/values/bpm'
import { toBpmIntegral } from '../../integrals/bpms'
import { removeFromStoreGrid } from '../../store/grid'

export const addBpm: AddMutation<ValueObject> = ({ store, bpms }, object) =>
    addValue(store, bpms, object, toBpmIntegral, toBpmEntity)

export const removeBpm: RemoveMutation<BpmEntity> = ({ store, bpms }, entity) => {
    removeFromOrdered(bpms, 'x', entity.beat)

    removeFromStoreGrid(store.grid, entity, entity.beat)
}
