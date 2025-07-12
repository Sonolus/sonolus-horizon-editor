import { createHoldNoteTool } from '..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { toDoubleHoldNoteJointEntity } from '../../../../state/entities/holdNotes/joints/double'
import {
    addDoubleHoldNoteJoint,
    removeDoubleHoldNoteJoint,
} from '../../../../state/mutations/holdNotes/double'
import { mod } from '../../../../utils/math'
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
    (entity, beat, laneOffset) => ({
        beat,
        color: entity.color,
        laneL: mod(entity.laneL + laneOffset, 8),
        laneR: mod(entity.laneR + laneOffset, 8),
    }),

    'doubleHoldNoteJoint',
    (joint, lane) => lane >= joint.laneL && lane <= joint.laneR,
    toDoubleHoldNoteJointEntity,
    addDoubleHoldNoteJoint,
    removeDoubleHoldNoteJoint,
)
