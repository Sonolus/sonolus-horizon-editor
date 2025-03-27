import { computed, shallowReactive, watch } from 'vue'
import { times } from '.'
import { bpms } from '../history/bpms'
import { settings } from '../settings'
import type { Entity } from '../state/entities'
import { beatToTime, timeToBeat } from '../state/integrals/bpms'
import { time } from '../time'
import { align, clamp, lerp, unlerp } from '../utils/math'
import { optional } from '../utils/optional'

export type Selection = {
    laneMin: number
    laneMax: number
    timeMin: number
    timeMax: number
}

export const view = shallowReactive({
    time: 0,
    hoverTime: 0,
    cursorTime: 0,

    hoverLane: -1,

    x: 0,
    y: 0,
    w: 0,
    h: 0,

    division: 4,

    visibilities: {
        bpm: true,
        timeScale: true,

        rotateEventJoint: true,
        rotateEventConnection: true,
        shiftEventJoint: true,
        shiftEventConnection: true,
        zoomEventJoint: true,
        zoomEventConnection: true,

        tapNote: true,

        singleHoldNoteJoint: true,
        singleHoldNoteConnection: true,
        doubleHoldNoteJoint: true,
        doubleHoldNoteConnection: true,
    },

    pointer: {
        x: 0,
        y: 0,
    },
    selection: optional<Selection>(),
    entities: {
        hovered: new Array<Entity>(),
        creating: new Array<Entity>(),
    },

    scrolling: optional<
        | {
              type: 'inertia'
              value: number
          }
        | {
              type: 'ease'
              from: {
                  time: number
                  viewTime: number
              }
              to: {
                  time: number
                  viewTime: number
              }
          }
    >(),
})

watch(time, ({ now, delta }) => {
    if (!view.scrolling) return

    switch (view.scrolling.type) {
        case 'inertia': {
            if (!view.scrolling.value) {
                view.scrolling = undefined
                break
            }

            const a = Math.sign(view.scrolling.value) * 800
            const t = Math.min(delta, view.scrolling.value / a)

            scrollViewBy(((2 * view.scrolling.value - a * t) * delta) / 2)

            view.scrolling.value -= a * t
            break
        }
        case 'ease': {
            if (now >= view.scrolling.to.time) {
                view.time = view.scrolling.to.viewTime
                view.scrolling = undefined
                return
            }

            view.time = lerp(
                view.scrolling.from.viewTime,
                view.scrolling.to.viewTime,
                1 - (1 - unlerp(view.scrolling.from.time, view.scrolling.to.time, now)) ** 2,
            )
            break
        }
    }
})

export const viewBox = computed(() => {
    const w = settings.width
    const h = (view.h / view.w) * w

    const l = -0.5 * w
    const r = 0.5 * w

    const y = -(view.time * settings.pps) / view.h
    const t = (y - 0.5) * h
    const b = (y + 0.5) * h

    const ups = -(settings.pps / view.h) * h

    return {
        w,
        h,

        l,
        r,

        y,
        t,
        b,

        ups,
    }
})

export const scrollViewBy = (dy: number, smooth = false) => {
    if (smooth) {
        view.scrolling = {
            type: 'ease',
            from: {
                time: time.value.now,
                viewTime: view.time,
            },
            to: {
                time: time.value.now + 0.25,
                viewTime: Math.max(
                    0,
                    (view.scrolling?.type === 'ease' ? view.scrolling.to.viewTime : view.time) +
                        dy / settings.pps,
                ),
            },
        }
    } else {
        view.time = Math.max(0, view.time + dy / settings.pps)
    }
}

export const setViewHover = (x: number, y: number) => {
    view.hoverLane = align(xToLane(x))
    view.hoverTime = Math.max(0, yToTime(y))
}

export const focusViewAtBeat = (beat: number) => {
    focusView(beatToTime(bpms.value, beat))
}

export const focusView = (t: number) => {
    view.cursorTime = t

    if (t >= times.value.min && t <= times.value.max) return

    view.scrolling = {
        type: 'ease',
        from: {
            time: time.value.now,
            viewTime: view.time,
        },
        to: {
            time: time.value.now + 0.25,
            viewTime: t,
        },
    }
}

export const updateViewPointer = (pointer?: { x: number; y: number }) => {
    if (!pointer) return

    view.pointer = {
        x: pointer.x,
        y: pointer.y,
    }
}

export const xToLane = (x: number) => (0.5 - (x - view.x) / view.w) * settings.width + 3.5

export const xToValidLane = (x: number) => clamp(align(xToLane(x)), 0, 7)

export const yToTime = (y: number) => (0.5 * view.h - y + view.y) / settings.pps + view.time

export const yToValidBeat = (y: number) => {
    const time = yToTime(y)
    if (time <= 0) return 0

    return align(timeToBeat(bpms.value, time), view.division)
}
