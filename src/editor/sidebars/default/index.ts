import type {
    DoubleHoldNoteJointObject,
    EventObject,
    SingleHoldNoteJointObject,
    TapNoteObject,
    ValueObject,
} from '../../../chart'
import { pushState, state } from '../../../history'
import { selectedEntities } from '../../../history/selectedEntities'
import { i18n } from '../../../i18n'
import type { Entity } from '../../../state/entities'
import type { RotateEventJointEntity } from '../../../state/entities/events/joints/rotate'
import type { ShiftEventJointEntity } from '../../../state/entities/events/joints/shift'
import type { ZoomEventJointEntity } from '../../../state/entities/events/joints/zoom'
import type { DoubleHoldNoteJointEntity } from '../../../state/entities/holdNotes/joints/double'
import type { SingleHoldNoteJointEntity } from '../../../state/entities/holdNotes/joints/single'
import type { TapNoteEntity } from '../../../state/entities/tapNote'
import type { BpmEntity } from '../../../state/entities/values/bpm'
import type { TimeScaleEntity } from '../../../state/entities/values/timeScale'
import { createTransaction, type Transaction } from '../../../state/transaction'
import { interpolate } from '../../../utils/interpolate'
import { notify } from '../../notification'
import { editRotateEventJoint, editSelectedRotateEventJoint } from '../../tools/events/rotate'
import { editSelectedShiftEventJoint, editShiftEventJoint } from '../../tools/events/shift'
import { editSelectedZoomEventJoint, editZoomEventJoint } from '../../tools/events/zoom'
import {
    editDoubleHoldNoteJoint,
    editSelectedDoubleHoldNoteJoint,
} from '../../tools/holdNotes/double'
import {
    editSelectedSingleHoldNoteJoint,
    editSingleHoldNoteJoint,
} from '../../tools/holdNotes/single'
import { editSelectedTapNote, editTapNote } from '../../tools/tapNote'
import { editBpm, editSelectedBpm } from '../../tools/values/bpm'
import { editSelectedTimeScale, editTimeScale } from '../../tools/values/timeScale'
import { view } from '../../view'

export type EditableObject = Partial<
    ValueObject &
        EventObject &
        TapNoteObject &
        SingleHoldNoteJointObject &
        DoubleHoldNoteJointObject
>

export type EditableEntity =
    | BpmEntity
    | TimeScaleEntity
    | RotateEventJointEntity
    | ShiftEventJointEntity
    | ZoomEventJointEntity
    | TapNoteEntity
    | SingleHoldNoteJointEntity
    | DoubleHoldNoteJointEntity

export const isEditableEntity = (entity: Entity) =>
    entity.type === 'bpm' ||
    entity.type === 'timeScale' ||
    entity.type === 'rotateEventJoint' ||
    entity.type === 'shiftEventJoint' ||
    entity.type === 'zoomEventJoint' ||
    entity.type === 'tapNote' ||
    entity.type === 'singleHoldNoteJoint' ||
    entity.type === 'doubleHoldNoteJoint'

export const editSelectedEditableEntities = (object: EditableObject) => {
    if (selectedEntities.value.length === 1) {
        const editEntity = getEditEntity()

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const entity = selectedEntities.value[0]!
        editEntity[entity.type]?.(entity as never, object)
    } else {
        const editSelectedEntity = getEditSelectedEntity()

        const transaction = createTransaction(state.value)

        const entities = selectedEntities.value.flatMap(
            (entity) =>
                editSelectedEntity[entity.type]?.(transaction, entity as never, object) ?? [entity],
        )

        pushState(
            interpolate(
                () => i18n.value.sidebar.default.edited,
                `${selectedEntities.value.length}`,
            ),
            {
                ...transaction.commit(),
                selectedEntities: entities,
            },
        )
        view.entities = {
            hovered: [],
            creating: [],
        }

        notify(
            interpolate(
                () => i18n.value.sidebar.default.edited,
                `${selectedEntities.value.length}`,
            ),
        )
    }
}

let editEntity:
    | {
          [T in Entity as T['type']]?: (entity: T, object: EditableObject) => void
      }
    | undefined

const getEditEntity = () =>
    (editEntity ??= {
        bpm: editBpm,
        timeScale: editTimeScale,

        rotateEventJoint: editRotateEventJoint,
        shiftEventJoint: editShiftEventJoint,
        zoomEventJoint: editZoomEventJoint,

        tapNote: editTapNote,

        singleHoldNoteJoint: editSingleHoldNoteJoint,
        doubleHoldNoteJoint: editDoubleHoldNoteJoint,
    })

let editSelectedEntity:
    | {
          [T in Entity as T['type']]?: (
              transaction: Transaction,
              entity: T,
              object: EditableObject,
          ) => Entity[]
      }
    | undefined

const getEditSelectedEntity = () =>
    (editSelectedEntity ??= {
        bpm: editSelectedBpm,
        timeScale: editSelectedTimeScale,

        rotateEventJoint: editSelectedRotateEventJoint,
        shiftEventJoint: editSelectedShiftEventJoint,
        zoomEventJoint: editSelectedZoomEventJoint,

        tapNote: editSelectedTapNote,

        singleHoldNoteJoint: editSelectedSingleHoldNoteJoint,
        doubleHoldNoteJoint: editSelectedDoubleHoldNoteJoint,
    })
