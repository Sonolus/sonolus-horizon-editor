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

export const doubleHoldNote = createHoldNoteTool(
    () => i18n.value.tools.holdNotes.types.doubleHoldNote,
    (entity) => showModal(DoubleHoldNotePropertiesModal, { object: entity }),

    (beat, lane, joint) => ({
        beat,
        color: joint?.color ?? 0,
        laneL: mod(lane, 8),
        laneR: mod(lane + (joint ? Math.abs(joint.laneL - joint.laneR) : 1), 8),
    }),
    (entity, beat, startLane, lane) => {
        const [laneL, laneR] =
            entity.laneL > entity.laneR
                ? [entity.laneR, entity.laneL]
                : [entity.laneL, entity.laneR]

        if ((startLane + 0.5) % 1 < 0.5) {
            if (align(startLane) === laneL)
                return {
                    beat: entity.beat,
                    color: entity.color,
                    laneL: mod(laneL + align(lane) - align(startLane), 8),
                    laneR,
                }
        } else {
            if (align(startLane) === laneR)
                return {
                    beat: entity.beat,
                    color: entity.color,
                    laneL,
                    laneR: mod(laneR + align(lane) - align(startLane), 8),
                }
        }

        return {
            beat,
            color: entity.color,
            laneL: mod(entity.laneL + align(lane) - align(startLane), 8),
            laneR: mod(entity.laneR + align(lane) - align(startLane), 8),
        }
    },

    'doubleHoldNoteJoint',
    (joint, lane) => lane >= joint.laneL && lane <= joint.laneR,
    toDoubleHoldNoteJointEntity,
    addDoubleHoldNoteJoint,
    removeDoubleHoldNoteJoint,
)
