import { computed, ref, type Component } from 'vue'
import type { Modifiers } from '../controls/gestures/pointer'
import { view } from '../view'
import { brush } from './brush'
import { eraser } from './eraser'
import { rotateEvent } from './events/rotate'
import { shiftEvent } from './events/shift'
import { zoomEvent } from './events/zoom'
import { doubleHoldNote } from './holdNotes/double'
import { singleHoldNote } from './holdNotes/single'
import { paste } from './paste'
import { select } from './select'
import { tapNote } from './tapNote'
import { bpm } from './values/bpm'
import { timeScale } from './values/timeScale'

export type Tool = {
    sidebar?: Component

    hover?: (x: number, y: number, modifiers: Modifiers) => void | Promise<void>

    tap?: (x: number, y: number, modifiers: Modifiers) => void | Promise<void>

    dragStart?: (x: number, y: number, modifiers: Modifiers) => boolean
    dragUpdate?: (x: number, y: number, modifiers: Modifiers) => void
    dragEnd?: (x: number, y: number, modifiers: Modifiers) => void | Promise<void>
}

export const tools = {
    select,
    eraser,
    brush,
    paste,

    tapNote,
    singleHoldNote,
    doubleHoldNote,

    rotateEvent,
    shiftEvent,
    zoomEvent,

    bpm,
    timeScale,
}

export type ToolName = keyof typeof tools

export const toolName = ref<ToolName>('select')

export const tool = computed(() => tools[toolName.value])

export const switchToolTo = (tool: ToolName) => {
    toolName.value = tool

    view.entities = {
        hovered: [],
        creating: [],
    }
}
