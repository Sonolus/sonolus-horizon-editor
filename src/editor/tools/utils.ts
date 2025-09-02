import { cullEntities, hitAllEntities, store } from '../../history/store'
import type { Entity } from '../../state/entities'
import { beatToKey } from '../../state/store/grid'
import type { Modifiers } from '../controls/gestures/pointer'
import { view, xToLane, yToTime, type Selection } from '../view'

export const hitAllEntitiesAtPoint = (x: number, y: number) =>
    hitAllEntities(xToLane(x + 10), xToLane(x - 10), yToTime(y + 10), yToTime(y - 10)).filter(
        isVisible,
    )

export const hitAllEntitiesInSelection = (selection: Selection) =>
    hitAllEntities(
        selection.laneMin,
        selection.laneMax,
        selection.timeMin,
        selection.timeMax,
    ).filter(isVisible)

export const modifyEntities = (entities: Entity[], modifiers: Modifiers) => {
    if (!modifiers.ctrl) return entities

    const allEntities = new Set(entities)

    for (const entity of entities) {
        if (entity.type !== 'singleHoldNoteJoint' && entity.type !== 'doubleHoldNoteJoint') continue

        const range = store.value.holdNoteRanges[entity.type].get(entity.id)
        if (!range) continue

        for (const joint of cullEntities(
            entity.type,
            beatToKey(range.min.beat),
            beatToKey(range.max.beat),
        )) {
            if (joint.id !== entity.id) continue

            allEntities.add(joint)
        }
    }

    return [...allEntities]
}

export const toSelection = (startLane: number, startTime: number, x: number, y: number) => {
    let laneMin = startLane
    let timeMin = startTime
    let laneMax = xToLane(x)
    let timeMax = yToTime(y)

    if (laneMin > laneMax) [laneMin, laneMax] = [laneMax, laneMin]
    if (timeMin > timeMax) [timeMin, timeMax] = [timeMax, timeMin]

    return {
        laneMin,
        laneMax,
        timeMin,
        timeMax,
    }
}

const isVisible = (entity: Entity) => view.visibilities[entity.type]
