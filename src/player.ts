import { watch } from 'vue'
import sfxUrl from './assets/perfect.mp3?url'
import { view } from './editor/view'
import { bgm } from './history/bgm'
import { bpms } from './history/bpms'
import { cullAllEntities } from './history/store'
import { settings } from './settings'
import { beatToTime, timeToBeat } from './state/integrals/bpms'
import { maxBeatToKey, minBeatToKey } from './state/store/grid'
import { time } from './time'

const delay = 0.2

const context = new AudioContext()

let sfxBuffer: AudioBuffer | undefined

let state:
    | {
          speed: number
          time: number
          cursorTime: number
          contextTime: number

          lastTime: number
          nodes: Set<AudioNode>
      }
    | undefined

let preview: AudioNode | undefined

watch(time, ({ now }) => {
    if (!state) return

    if (sfxBuffer) {
        const targets = new Set<number>()

        const beats = {
            min: timeToBeat(
                bpms.value,
                (state.lastTime - state.time) * state.speed + state.cursorTime,
            ),
            max: timeToBeat(bpms.value, (now - state.time) * state.speed + state.cursorTime),
        }

        for (const entity of cullAllEntities(minBeatToKey(beats.min), maxBeatToKey(beats.max))) {
            if (entity.beat < beats.min || entity.beat >= beats.max) continue

            if (
                entity.type !== 'tapNote' &&
                entity.type !== 'singleHoldNoteJoint' &&
                entity.type !== 'doubleHoldNoteJoint'
            )
                continue

            targets.add(entity.beat)
        }

        for (const beat of targets) {
            schedule(
                state.nodes,
                sfxBuffer,
                settings.playSfxVolume,
                (beatToTime(bpms.value, beat) - state.cursorTime) / state.speed +
                    state.contextTime +
                    delay,
            )
        }
    }

    state.lastTime = now
})

export const loadBgm = (data: ArrayBuffer) => context.decodeAudioData(data)

export const startPlayer = (speed: number) => {
    const time = performance.now() / 1000
    const cursorTime = view.cursorTime
    const contextTime = context.currentTime

    state = {
        speed,
        time,
        cursorTime,
        contextTime,

        lastTime: time,
        nodes: new Set(),
    }

    startContext()

    if (bgm.value.buffer)
        schedule(
            state.nodes,
            bgm.value.buffer,
            settings.playBgmVolume,
            contextTime + delay,
            cursorTime + bgm.value.offset,
            speed,
        )

    return time + delay
}

export const stopPlayer = () => {
    if (!state) return

    for (const node of state.nodes) {
        node.disconnect()
    }

    state = undefined
}

export const previewPlayer = () => {
    startContext()

    if (!bgm.value.buffer) return

    const offset = view.cursorTime + bgm.value.offset
    if (offset < 0) return

    const source = new AudioBufferSourceNode(context, {
        buffer: bgm.value.buffer,
    })
    const gain = new GainNode(context, {
        gain: settings.playBgmVolume / 100,
    })

    gain.connect(context.destination)
    preview = gain

    source.connect(gain)

    const time = context.currentTime
    gain.gain.linearRampToValueAtTime(0, time + 0.5)
    source.start(time, offset, 0.5)
}

const startContext = () => {
    if (context.state !== 'running') {
        void context.resume()
    }

    if (preview) {
        preview.disconnect()
        preview = undefined
    }
}

const schedule = (
    nodes: Set<AudioNode>,
    buffer: AudioBuffer,
    volume: number,
    when: number,
    offset = 0,
    speed = 1,
) => {
    const source = new AudioBufferSourceNode(context, {
        buffer,
        playbackRate: speed,
    })
    const gain = new GainNode(context, {
        gain: volume / 100,
    })

    gain.connect(context.destination)
    nodes.add(gain)

    source.connect(gain)
    source.onended = () => {
        gain.disconnect()
        nodes.delete(gain)
    }

    if (offset < 0) {
        source.start(when - offset / speed)
    } else {
        source.start(when, offset)
    }
}

const loadSfx = async () => {
    const response = await fetch(sfxUrl)
    const data = await response.arrayBuffer()
    sfxBuffer = await context.decodeAudioData(data)
}

void loadSfx()
