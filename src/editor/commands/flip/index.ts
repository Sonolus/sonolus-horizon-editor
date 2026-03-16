import type { Command } from '..'
import { pushState, state } from '../../../history'
import { selectedEntities } from '../../../history/selectedEntities'
import { i18n } from '../../../i18n'
import type { Entity } from '../../../state/entities'
import type { RotateEventJointEntity } from '../../../state/entities/events/joints/rotate'
import { addRotateEventJoint, removeRotateEventJoint } from '../../../state/mutations/events/rotate'
import {
    addDoubleHoldNoteJoint,
    removeDoubleHoldNoteJoint,
} from '../../../state/mutations/holdNotes/double'
import {
    addSingleHoldNoteJoint,
    removeSingleHoldNoteJoint,
} from '../../../state/mutations/holdNotes/single'
import { addTapNote, removeTapNote } from '../../../state/mutations/tapNote'
import { getInStoreGrid } from '../../../state/store/grid'
import { createTransaction, type Transaction } from '../../../state/transaction'
import { interpolate } from '../../../utils/interpolate'
import { notify } from '../../notification'
import { view } from '../../view'
import FlipIcon from './FlipIcon.vue'

export const flip: Command = {
    title: () => i18n.value.commands.flip.title,
    icon: {
        is: FlipIcon,
    },

    execute() {
        const entities = selectedEntities.value

        if (!entities.length) {
            notify(() => i18n.value.commands.flip.noSelected)
            return
        }

        let first: RotateEventJointEntity | undefined
        for (const entity of entities) {
            if (entity.type !== 'rotateEventJoint') continue
            if (first && entity.beat > first.beat) continue

            first = entity
        }
        const center = Math.floor(((first?.value ?? 0) - 0.5) / 8) * 8 + 4.5

        const transaction = createTransaction(state.value)

        const flippedEntities = entities.flatMap(
            (entity) => flips[entity.type]?.(transaction, entity as never, center) ?? [entity],
        )

        pushState(
            interpolate(() => i18n.value.commands.flip.flipped, `${entities.length}`),
            {
                ...transaction.commit(),
                selectedEntities: flippedEntities,
            },
        )
        view.entities = {
            hovered: [],
            creating: [],
        }

        notify(interpolate(() => i18n.value.commands.flip.flipped, `${entities.length}`))
    },
}

type Flip<T> = (transaction: Transaction, entity: T, center: number) => Entity[] | undefined

const flips: {
    [T in Entity as T['type']]?: Flip<T>
} = {
    rotateEventJoint: (transaction, entity, center) => {
        const value = center - (entity.value - center)
        if (value === entity.value) return

        removeRotateEventJoint(transaction, entity)
        return addRotateEventJoint(transaction, {
            beat: entity.beat,
            value,
            ease: entity.ease,
            ignoreTimeScale: entity.ignoreTimeScale,
        })
    },

    tapNote: (transaction, entity) => {
        const beat = entity.beat
        const lane = 7 - entity.lane

        removeTapNote(transaction, entity)

        const overlap = getInStoreGrid(transaction.store.grid, 'tapNote', beat)?.find(
            (entity) => entity.beat === beat && entity.lane === lane,
        )
        if (overlap) removeTapNote(transaction, overlap)

        return addTapNote(transaction, {
            beat,
            color: entity.color,
            lane,
        })
    },

    singleHoldNoteJoint: (transaction, entity) => {
        removeSingleHoldNoteJoint(transaction, entity)
        return addSingleHoldNoteJoint(transaction, entity.id, {
            beat: entity.beat,
            color: entity.color,
            lane: 7 - entity.lane,
            scaleL: entity.scaleR,
            scaleR: entity.scaleL,
        })
    },

    doubleHoldNoteJoint: (transaction, entity) => {
        removeDoubleHoldNoteJoint(transaction, entity)
        return addDoubleHoldNoteJoint(transaction, entity.id, {
            beat: entity.beat,
            color: entity.color,
            laneL: 7 - entity.laneR,
            laneR: 7 - entity.laneL,
        })
    },
}
