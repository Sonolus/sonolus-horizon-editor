import type { ValueObject } from '../../../chart'
import { addToOrdered } from '../../../utils/ordered'
import type { EntityOfType } from '../../entities'
import type { ValueEntityType } from '../../entities/values'
import type { Integral } from '../../integrals'
import type { Store } from '../../store'
import { addToStoreGrid } from '../../store/grid'

export const addValue = <T extends Integral, U extends ValueEntityType>(
    store: Store,
    integrals: T[],
    object: ValueObject,
    toIntegral: (object: ValueObject) => T,
    toEntity: (object: ValueObject) => EntityOfType<U>,
) => {
    addToOrdered(integrals, 'x', toIntegral(object))

    const entity = toEntity(object)
    addToStoreGrid(store.grid, entity, entity.beat)

    return [entity]
}
