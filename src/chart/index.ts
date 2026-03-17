export type Chart = {
    bpms: ValueObject[]
    timeScales: ValueObject[]

    rotateEvents: EventObject[]
    shiftEvents: EventObject[]
    zoomEvents: EventObject[]

    tapNotes: TapNoteObject[]

    singleHoldNotes: SingleHoldNoteObject[]
    doubleHoldNotes: DoubleHoldNoteObject[]
}

export type ValueObject = {
    beat: number
    value: number
}

export type EventObject = {
    beat: number
    value: number
    ease: Ease
}

export type Ease = 'one' | 'out' | 'linear' | 'in' | 'zero'

export type TapNoteObject = {
    beat: number
    color: number
    lane: number
}

export type SingleHoldNoteObject = SingleHoldNoteJointObject[]

export type SingleHoldNoteJointObject = {
    beat: number
    color: number
    lane: number
    scaleL: number
    scaleR: number
}

export type DoubleHoldNoteObject = DoubleHoldNoteJointObject[]

export type DoubleHoldNoteJointObject = {
    beat: number
    color: number
    laneL: number
    laneR: number
}

export type HoldNoteJointObject = SingleHoldNoteJointObject | DoubleHoldNoteJointObject
