import Type from 'typebox'

export const beatSchema = Type.Number({ minimum: 0 })

export const scaleSchema = Type.Number({ minimum: 0, maximum: 1 })

export const colorSchema = Type.Number({ minimum: 0, maximum: 6, multipleOf: 1 })

export const laneSchema = Type.Number({ minimum: 0, maximum: 7, multipleOf: 1 })
