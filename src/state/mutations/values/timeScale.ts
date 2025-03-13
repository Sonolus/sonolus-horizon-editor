import { addValue } from '.'
import type { AddMutation, RemoveMutation } from '..'
import type { ValueObject } from '../../../chart'
import { removeFromOrdered } from '../../../utils/ordered'
import { toTimeScaleEntity, type TimeScaleEntity } from '../../entities/values/timeScale'
import { toTimeScaleIntegral } from '../../integrals/timeScales'
import { removeFromStoreGrid } from '../../store/grid'

export const addTimeScale: AddMutation<ValueObject> = ({ store, timeScales }, object) =>
    addValue(store, timeScales, object, toTimeScaleIntegral, toTimeScaleEntity)

export const removeTimeScale: RemoveMutation<TimeScaleEntity> = ({ store, timeScales }, entity) => {
    removeFromOrdered(timeScales, 'beat', entity.beat)

    removeFromStoreGrid(store.grid, entity, entity.beat)
}
