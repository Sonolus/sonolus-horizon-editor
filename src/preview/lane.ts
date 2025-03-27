import { toPoints } from './polygon'
import { transform } from './projection'
import { Vec } from './Vec'

export const getLane = (lane: number, scale: number, shift: number, rotate: number) => {
    const m = new Vec(0, -Math.cos(Math.PI / 8))
    const x = Math.sin(Math.PI / 8)
    const y = -shift * 0.2
    const a = (-(lane + rotate) / 4) * Math.PI

    return [
        m.translate(-x, 0).mul(scale).translate(0, y).rotate(a),
        m.translate(x, 0).mul(scale).translate(0, y).rotate(a),
    ] as const
}

export const getLaneCenter = (lane: number, scale: number, shift: number, rotate: number) => {
    const m = new Vec(0, -1)
    const y = -shift * 0.2
    const a = (-(lane + rotate) / 4) * Math.PI

    return m.mul(scale).translate(0, y).rotate(a)
}

export const laneLayout = (l: Vec, r: Vec) =>
    toPoints(transform(l, 1), transform(l, 0), transform(r, 0), transform(r, 1))
