import { settings } from '../../settings'
import { stopPlayer } from '../player'
import { switchToolTo, tool, toolName, type ToolName } from '../tools'
import { scrollViewBy, setViewHover, updateViewPointer, view } from '../view'
import { gesture } from './gestures/gesture'
import { drag } from './gestures/recognizers/drag'
import { tap } from './gestures/recognizers/tap'

const mouseGesture = gesture(drag(), tap())

const toP = (event: MouseEvent) => ({
    id: 1,
    x: event.clientX,
    y: event.clientY,
    isShift: event.shiftKey,
})

let secondarySwitchBack: ToolName | undefined

const mousedown = (event: MouseEvent) => {
    const p = toP(event)
    updateViewPointer(p)

    view.scrolling = undefined
    stopPlayer(false)

    if (!mouseGesture.pointerCount && event.buttons & 2 && !secondarySwitchBack) {
        secondarySwitchBack = toolName.value
        switchToolTo(settings.mouseSecondaryTool)
    }

    mouseGesture.start([p])

    event.preventDefault()
}

const mousemove = (event: MouseEvent) => {
    const p = toP(event)
    updateViewPointer(p)

    if (mouseGesture.pointerCount) {
        mouseGesture.move([p])
    } else {
        setViewHover(p.x, p.y)
        void tool.value.hover?.(p.x, p.y, p.isShift)
    }

    event.preventDefault()
}

const mouseup = (event: MouseEvent) => {
    const p = toP(event)
    updateViewPointer(p)

    mouseGesture.end([p])

    if (!mouseGesture.pointerCount && secondarySwitchBack) {
        switchToolTo(secondarySwitchBack)
        secondarySwitchBack = undefined
    }

    event.preventDefault()
}

const mouseleave = (event: MouseEvent) => {
    const p = toP(event)
    updateViewPointer(p)

    mouseGesture.end([p])

    event.preventDefault()
}

const wheel = (event: WheelEvent) => {
    switch (event.deltaMode) {
        case WheelEvent.DOM_DELTA_PIXEL:
            scrollViewBy(-event.deltaY, settings.mouseSmoothScrolling)
            break
        case WheelEvent.DOM_DELTA_LINE:
            scrollViewBy(-(event.deltaY * 20), settings.mouseSmoothScrolling)
            break
        case WheelEvent.DOM_DELTA_PAGE:
            scrollViewBy(-event.deltaY * view.h, settings.mouseSmoothScrolling)
            break
    }

    event.preventDefault()
}

export const mouseControlListeners = {
    mousedown,
    mousemove,
    mouseup,
    mouseleave,
    wheel,
}
