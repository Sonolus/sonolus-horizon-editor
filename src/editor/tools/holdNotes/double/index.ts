import { createHoldNoteTool } from '..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { toDoubleHoldNoteJointEntity } from '../../../../state/entities/holdNotes/joints/double'
import {
    addDoubleHoldNoteJoint,
    removeDoubleHoldNoteJoint,
} from '../../../../state/mutations/holdNotes/double'
import { align, mod } from '../../../../utils/math'
import DoubleHoldNotePropertiesModal from './DoubleHoldNotePropertiesModal.vue'

export type DoubleHoldNoteProperties = {
    color?: number
    size?: number
}

export let doubleHoldNoteProperties: DoubleHoldNoteProperties = {}

export const setDoubleHoldNoteProperties = (properties: DoubleHoldNoteProperties) => {
    doubleHoldNoteProperties = properties
}

export const doubleHoldNote = createHoldNoteTool(
    () => i18n.value.tools.holdNotes.types.doubleHoldNote,
    (entity) => showModal(DoubleHoldNotePropertiesModal, { object: entity }),

    (beat, lane, joint) => ({
        beat,
        color: doubleHoldNoteProperties.color ?? joint?.color ?? 0,
        laneL: mod(
            lane -
                (doubleHoldNoteProperties.size ??
                    (joint ? Math.abs(joint.laneL - joint.laneR) : 1)),
            8,
        ),
        laneR: mod(lane, 8),
    }),
    (entity, beat, startLane, lane) => {
        const laneL = Math.min(entity.laneL, entity.laneR)
        const laneR = Math.max(entity.laneL, entity.laneR)

        if (startLane < laneL)
            return {
                beat: entity.beat,
                color: entity.color,
                laneL: mod(laneL + align(lane) - align(startLane), 8),
                laneR,
            }

        if (startLane > laneR)
            return {
                beat: entity.beat,
                color: entity.color,
                laneL,
                laneR: mod(laneR + align(lane) - align(startLane), 8),
            }

        return {
            beat,
            color: entity.color,
            laneL: mod(laneL + align(lane) - align(startLane), 8),
            laneR: mod(laneR + align(lane) - align(startLane), 8),
        }
    },
    (beat, startLane, lane, joint) => ({
        beat,
        color: doubleHoldNoteProperties.color ?? joint?.color ?? 0,
        laneL: startLane,
        laneR: lane,
    }),

    'doubleHoldNoteJoint',
    (joint, lane) => lane >= joint.laneL && lane <= joint.laneR,
    toDoubleHoldNoteJointEntity,
    addDoubleHoldNoteJoint,
    removeDoubleHoldNoteJoint,
)
