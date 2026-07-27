import type { Tool } from '..'
import { pushState, replaceState, state } from '../../../history'
import { selectedEntities } from '../../../history/selectedEntities'
import { cullAllEntities, store } from '../../../history/store'
import { i18n } from '../../../i18n'
import type { Entity } from '../../../state/entities'
import type { HoldNoteId } from '../../../state/entities/holdNotes'
import type { HoldNoteJointEntity } from '../../../state/entities/holdNotes/joints'
import { addDoubleHoldNoteJoint } from '../../../state/mutations/holdNotes/double'
import { addSingleHoldNoteJoint } from '../../../state/mutations/holdNotes/single'
import { beatToKey } from '../../../state/store/grid'
import { createTransaction } from '../../../state/transaction'
import { interpolate } from '../../../utils/interpolate'
import { notify } from '../../notification'
import { focusViewAtBeat, setViewHover, view, xToLane, yToTime, yToValidBeat } from '../../view'
import { defaultDoubleHoldNoteProperties } from '../holdNotes/double'
import { defaultSingleHoldNoteProperties } from '../holdNotes/single'
import { hitAllEntitiesAtPoint, hitAllEntitiesInSelection, toSelection } from '../utils'

let active:
    | {
          lane: number
          time: number
          count: number
      }
    | undefined

export const generateHoldNotes: Tool = {
    title: () => i18n.value.tools.generateHoldNotes.title,

    hover(x, y) {
        const entities = filter(hitAllEntitiesAtPoint(x, y))

        view.entities = {
            hovered: entities,
            creating: [],
        }
    },

    tap(x, y) {
        const entities = filter(hitAllEntitiesAtPoint(x, y))

        if (entities.some((entity) => selectedEntities.value.includes(entity))) {
            apply(filter(selectedEntities.value))
            focusViewAtBeat(yToValidBeat(y))
        } else {
            const [entity] = entities
            if (entity) {
                apply(entities)
                focusViewAtBeat(entity.beat)
            } else {
                const selectedLength = selectedEntities.value.length

                replaceState({
                    ...state.value,
                    selectedEntities: [],
                })
                view.entities = {
                    hovered: [],
                    creating: [],
                }

                focusViewAtBeat(yToValidBeat(y))
                if (selectedLength) notify(() => i18n.value.tools.generateHoldNotes.deselected)
            }
        }
    },

    dragStart(x, y) {
        active = {
            lane: xToLane(x),
            time: yToTime(y),
            count: -1,
        }

        return true
    },

    dragUpdate(x, y) {
        if (!active) return

        setViewHover(x, y)

        const selection = toSelection(active.lane, active.time, x, y)
        const targets = filter(hitAllEntitiesInSelection(selection))

        replaceState({
            ...state.value,
            selectedEntities: targets,
        })
        view.selection = selection
        view.entities = {
            hovered: [],
            creating: [],
        }

        if (active.count === targets.length) return
        active.count = targets.length

        notify(interpolate(() => i18n.value.tools.generateHoldNotes.selecting, `${targets.length}`))
    },

    dragEnd(x, y) {
        if (!active) return

        const selection = toSelection(active.lane, active.time, x, y)

        view.selection = undefined

        apply(filter(hitAllEntitiesInSelection(selection)))

        active = undefined
    },
}

const filter = (entities: Entity[]) =>
    entities.filter(
        (entity) => entity.type === 'singleHoldNoteJoint' || entity.type === 'doubleHoldNoteJoint',
    )

const apply = (joints: HoldNoteJointEntity[]) => {
    const transaction = createTransaction(state.value)

    const entities: Entity[] = []

    const holds = new Map<HoldNoteId, [HoldNoteJointEntity, ...HoldNoteJointEntity[]]>()
    for (const joint of joints) {
        const hold = holds.get(joint.id)
        if (hold) {
            hold.push(joint)
        } else {
            holds.set(joint.id, [joint])
        }
    }

    for (const [id, joints] of holds) {
        const type = joints[0].type

        let minBeat = Number.POSITIVE_INFINITY
        let maxBeat = Number.NEGATIVE_INFINITY
        if (joints.length > 1) {
            for (const joint of joints) {
                minBeat = Math.min(minBeat, joint.beat)
                maxBeat = Math.max(maxBeat, joint.beat)
            }
        } else {
            const range = store.value.holdNoteRanges[type].get(id)
            if (!range) throw new Error('Unexpected range not found')

            minBeat = range.min.beat
            maxBeat = range.max.beat
        }

        const disallowed = new Set<number>()
        for (const entity of cullAllEntities(beatToKey(minBeat), beatToKey(maxBeat))) {
            if (entity.type !== type || entity.id !== id) continue

            disallowed.add(entity.beat * view.division)
        }

        const min = Math.floor(minBeat * view.division) + 1
        const max = Math.ceil(maxBeat * view.division) - 1
        for (let i = min; i <= max; i++) {
            if (disallowed.has(i)) continue

            switch (type) {
                case 'singleHoldNoteJoint':
                    entities.push(
                        ...addSingleHoldNoteJoint(transaction, id, {
                            beat: i / view.division,
                            color: defaultSingleHoldNoteProperties.value.color ?? joints[0].color,
                            lane: joints[0].lane,
                            scaleL:
                                defaultSingleHoldNoteProperties.value.scaleL ?? joints[0].scaleL,
                            scaleR:
                                defaultSingleHoldNoteProperties.value.scaleR ?? joints[0].scaleR,
                        }),
                    )
                    break
                case 'doubleHoldNoteJoint':
                    entities.push(
                        ...addDoubleHoldNoteJoint(transaction, id, {
                            beat: i / view.division,
                            color: defaultDoubleHoldNoteProperties.value.color ?? joints[0].color,
                            laneL: joints[0].laneL,
                            laneR: joints[0].laneR,
                        }),
                    )
                    break
            }
        }
    }

    pushState(
        interpolate(() => i18n.value.tools.generateHoldNotes.generated, `${entities.length}`),
        {
            ...transaction.commit(),
            selectedEntities: entities,
        },
    )
    view.entities = {
        hovered: [],
        creating: [],
    }

    notify(interpolate(() => i18n.value.tools.generateHoldNotes.generated, `${entities.length}`))
}
