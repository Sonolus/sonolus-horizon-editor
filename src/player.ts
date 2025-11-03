import { watch } from 'vue'
import doubleUrl from './assets/double.mp3?url'
import perfectUrl from './assets/perfect.mp3?url'
import singleUrl from './assets/single.mp3?url'
import { view } from './editor/view'
import { bgm } from './history/bgm'
import { bpms } from './history/bpms'
import { cullAllEntities } from './history/store'
import { settings } from './settings'
import { beatToTime, timeToBeat } from './state/integrals/bpms'
import { beatToKey } from './state/store/grid'
import { time } from './time'
import { optional } from './utils/optional'

const delay = 0.2

const context = new AudioContext()

const sfxBuffers = {
    perfect: optional<AudioBuffer>(),
    single: optional<AudioBuffer>(),
    double: optional<AudioBuffer>(),
}

let state:
    | {
          speed: number
          time: number
          bgmTime: number
          contextTime: number

          lastTime: number
          nodes: Set<AudioNode>
      }
    | undefined

let preview: AudioNode | undefined

watch(time, ({ now }) => {
    if (!state) return

    const targets = {
        perfect: new Set<number>(),
        single: new Set<number>(),
        double: new Set<number>(),
    }

    const beats = {
        min: timeToBeat(bpms.value, (state.lastTime - state.time) * state.speed + state.bgmTime),
        max: timeToBeat(bpms.value, (now - state.time) * state.speed + state.bgmTime),
    }

    for (const entity of cullAllEntities(beatToKey(beats.min), beatToKey(beats.max))) {
        if (entity.beat < beats.min || entity.beat >= beats.max) continue

        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        switch (entity.type) {
            case 'tapNote':
                targets.perfect.add(entity.beat)
                break
            case 'singleHoldNoteJoint':
                targets.single.add(entity.beat)
                break
            case 'doubleHoldNoteJoint':
                targets.double.add(entity.beat)
                break
        }
    }

    for (const type of ['perfect', 'single', 'double'] as const) {
        if (!sfxBuffers[type]) continue

        for (const beat of targets[type]) {
            schedule(
                state.nodes,
                sfxBuffers[type],
                settings.playSfxVolume,
                (beatToTime(bpms.value, beat) - state.bgmTime) / state.speed +
                    state.contextTime +
                    delay,
            )
        }
    }

    state.lastTime = now
})

export const loadBgm = (data: ArrayBuffer) => context.decodeAudioData(data)

export const startPlayer = (bgmTime: number, speed: number) => {
    const time = performance.now() / 1000
    const contextTime = context.currentTime

    state = {
        speed,
        time,
        bgmTime,
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
            bgmTime + bgm.value.offset,
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

const loadSfx = () => {
    const load = async (type: keyof typeof sfxBuffers, url: string) => {
        const response = await fetch(url)
        const data = await response.arrayBuffer()
        sfxBuffers[type] = await context.decodeAudioData(data)
    }

    void load('perfect', perfectUrl)
    void load('single', singleUrl)
    void load('double', doubleUrl)
}

loadSfx()
