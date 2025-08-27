import { createHoldNoteTool } from '..'
import { i18n } from '../../../../i18n'
import { showModal } from '../../../../modals'
import { toSingleHoldNoteJointEntity } from '../../../../state/entities/holdNotes/joints/single'
import {
    addSingleHoldNoteJoint,
    removeSingleHoldNoteJoint,
} from '../../../../state/mutations/holdNotes/single'
import { align, mod } from '../../../../utils/math'
import SingleHoldNotePropertiesModal from './SingleHoldNotePropertiesModal.vue'
import SingleHoldNoteSidebar from './SingleHoldNoteSidebar.vue'

export type DefaultSingleHoldNoteProperties = {
    color?: number
    scaleL?: number
    scaleR?: number
}

export let defaultSingleHoldNoteProperties: DefaultSingleHoldNoteProperties = {}

export const setDefaultSingleHoldNoteProperties = (properties: DefaultSingleHoldNoteProperties) => {
    defaultSingleHoldNoteProperties = properties
}

export const [singleHoldNote, editSelectedSingleHoldNoteJoints] = createHoldNoteTool(
    () => i18n.value.tools.holdNotes.types.singleHoldNote,
    SingleHoldNoteSidebar,
    (entity) => showModal(SingleHoldNotePropertiesModal, { object: entity }),

    (beat, lane, joint) => ({
        beat,
        color: defaultSingleHoldNoteProperties.color ?? joint?.color ?? 0,
        lane,
        scaleL: defaultSingleHoldNoteProperties.scaleL ?? joint?.scaleL ?? 0,
        scaleR: defaultSingleHoldNoteProperties.scaleR ?? joint?.scaleR ?? 0,
    }),
    (entity, beat, startLane, lane) => ({
        beat,
        color: entity.color,
        lane: mod(entity.lane + align(lane) - align(startLane), 8),
        scaleL: entity.scaleL,
        scaleR: entity.scaleR,
    }),
    (beat, startLane, lane, joint) => ({
        beat,
        color: defaultSingleHoldNoteProperties.color ?? joint?.color ?? 0,
        lane,
        scaleL: defaultSingleHoldNoteProperties.scaleL ?? joint?.scaleL ?? 0,
        scaleR: defaultSingleHoldNoteProperties.scaleR ?? joint?.scaleR ?? 0,
    }),
    (entity, object) => ({
        beat: object.beat ?? entity.beat,
        color: object.color ?? entity.color,
        lane: object.lane ?? entity.lane,
        scaleL: object.scaleL ?? entity.scaleL,
        scaleR: object.scaleR ?? entity.scaleR,
    }),

    'singleHoldNoteJoint',
    (joint, lane) => joint.lane === lane,
    toSingleHoldNoteJointEntity,
    addSingleHoldNoteJoint,
    removeSingleHoldNoteJoint,
)
