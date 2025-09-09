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
import DoubleHoldNoteSidebar from './DoubleHoldNoteSidebar.vue'

export type DefaultDoubleHoldNoteProperties = {
    color?: number
    size?: number
}

export let defaultDoubleHoldNoteProperties: DefaultDoubleHoldNoteProperties = {}

export const setDefaultDoubleHoldNoteProperties = (properties: DefaultDoubleHoldNoteProperties) => {
    defaultDoubleHoldNoteProperties = properties
}

export const [doubleHoldNote, editDoubleHoldNoteJoint, editSelectedDoubleHoldNoteJoint] =
    createHoldNoteTool(
        () => i18n.value.tools.holdNotes.types.doubleHoldNote,
        DoubleHoldNoteSidebar,
        () => showModal(DoubleHoldNotePropertiesModal, {}),

        (beat, lane, joint) => ({
            beat,
            color: defaultDoubleHoldNoteProperties.color ?? joint?.color ?? 0,
            laneL: mod(
                lane -
                    (defaultDoubleHoldNoteProperties.size ??
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
            color: defaultDoubleHoldNoteProperties.color ?? joint?.color ?? 0,
            laneL: startLane,
            laneR: lane,
        }),
        (entity, object) => ({
            beat: object.beat ?? entity.beat,
            color: object.color ?? entity.color,
            laneL: object.laneL ?? entity.laneL,
            laneR: object.laneR ?? entity.laneR,
        }),
        (entity) => ({
            color: (entity.color + 1) % 7,
        }),

        'doubleHoldNoteJoint',
        (joint, lane) => lane >= joint.laneL && lane <= joint.laneR,
        toDoubleHoldNoteJointEntity,
        addDoubleHoldNoteJoint,
        removeDoubleHoldNoteJoint,
    )
