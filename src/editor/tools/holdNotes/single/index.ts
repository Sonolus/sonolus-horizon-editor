import { createHoldNoteTool } from '..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { toSingleHoldNoteJointEntity } from '../../../../state/entities/holdNotes/joints/single'
import {
    addSingleHoldNoteJoint,
    removeSingleHoldNoteJoint,
} from '../../../../state/mutations/holdNotes/single'
import { mod } from '../../../../utils/math'
import SingleHoldNotePropertiesModal from './SingleHoldNotePropertiesModal.vue'

export const singleHoldNote = createHoldNoteTool(
    () => i18n.value.tools.holdNotes.types.singleHoldNote,
    (entity) => showModal(SingleHoldNotePropertiesModal, { object: entity }),

    (beat, lane, joint) => ({
        beat,
        color: joint?.color ?? 0,
        lane,
        scaleL: joint?.scaleL ?? 0,
        scaleR: joint?.scaleR ?? 0,
    }),
    (entity, beat, laneOffset) => ({
        beat,
        color: entity.color,
        lane: mod(entity.lane + laneOffset, 8),
        scaleL: entity.scaleL,
        scaleR: entity.scaleR,
    }),

    'singleHoldNoteJoint',
    (joint, lane) => joint.lane === lane,
    toSingleHoldNoteJointEntity,
    addSingleHoldNoteJoint,
    removeSingleHoldNoteJoint,
)
