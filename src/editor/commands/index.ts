import type { Component } from 'vue'
import { bgm } from './bgm'
import { brush } from './brush'
import { copy } from './copy'
import { cut } from './cut'
import { deselect } from './deselect'
import { division } from './divisions'
import { divisionCustom } from './divisions/custom'
import { eraser } from './eraser'
import { rotateEvent } from './events/rotate'
import { shiftEvent } from './events/shift'
import { zoomEvent } from './events/zoom'
import { flip } from './flip'
import { fullscreen } from './fullscreen'
import { help } from './help'
import { doubleHoldNote } from './holdNotes/double'
import { singleHoldNote } from './holdNotes/single'
import { jumpDown } from './jumpDown'
import { jumpUp } from './jumpUp'
import { open } from './open'
import { paste } from './paste'
import { play } from './play'
import { redo } from './redo'
import { reset } from './reset'
import { save } from './save'
import { scrollDown } from './scrollDown'
import { scrollPageDown } from './scrollPageDown'
import { scrollPageUp } from './scrollPageUp'
import { scrollUp } from './scrollUp'
import { select } from './select'
import { settings } from './settings'
import { snapping } from './snapping'
import { speedDown } from './speedDown'
import { speedUp } from './speedUp'
import { stop } from './stop'
import { tapNote } from './tapNote'
import { undo } from './undo'
import { utilities } from './utilities'
import { bpm } from './values/bpm'
import { timeScale } from './values/timeScale'
import { bpmVisibility } from './visibilities/bpm'
import { cycleVisibilities } from './visibilities/cycle'
import { doubleHoldNoteVisibility } from './visibilities/doubleHoldNote'
import { rotateEventVisibility } from './visibilities/rotateEvent'
import { shiftEventVisibility } from './visibilities/shiftEvent'
import { singleHoldNoteVisibility } from './visibilities/singleHoldNote'
import { tapNoteVisibility } from './visibilities/tapNote'
import { timeScaleVisibility } from './visibilities/timeScale'
import { zoomEventVisibility } from './visibilities/zoomEvent'
import { zoomXIn } from './zoom/zoomXIn'
import { zoomXOut } from './zoom/zoomXOut'
import { zoomYIn } from './zoom/zoomYIn'
import { zoomYOut } from './zoom/zoomYOut'

export type Command = {
    title: () => string
    icon: {
        is: Component
        props?: object
    }

    execute: () => void | Promise<void>
}

export const commands = {
    open,
    save,
    reset,
    utilities,

    play,
    stop,
    speedUp,
    speedDown,
    bgm,

    select,
    deselect,
    eraser,
    brush,
    flip,
    cut,
    copy,
    paste,
    undo,
    redo,

    tapNote,
    singleHoldNote,
    doubleHoldNote,

    rotateEvent,
    shiftEvent,
    zoomEvent,

    bpm,
    timeScale,

    scrollUp,
    scrollDown,
    scrollPageUp,
    scrollPageDown,
    jumpUp,
    jumpDown,

    cycleVisibilities,
    doubleHoldNoteVisibility,
    singleHoldNoteVisibility,
    tapNoteVisibility,
    rotateEventVisibility,
    shiftEventVisibility,
    zoomEventVisibility,
    bpmVisibility,
    timeScaleVisibility,

    division1: division(1),
    division2: division(2),
    division3: division(3),
    division4: division(4),
    division6: division(6),
    division8: division(8),
    division12: division(12),
    division16: division(16),
    divisionCustom,
    snapping,

    zoomXIn,
    zoomXOut,
    zoomYIn,
    zoomYOut,

    help,
    settings,
    fullscreen,
}

export type CommandName = keyof typeof commands

export const isCommandName = (name: string): name is CommandName => name in commands
