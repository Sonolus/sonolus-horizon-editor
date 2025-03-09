export const formatTime = (time: number) =>
    `${`${Math.floor(time / 60)}`.padStart(2, '0')}:${(time % 60).toFixed(3).padStart(6, '0')}`

export const formatBeat = (beat: number) => beat.toFixed(3)

export const formatBpm = (value: number) => `${value}`

export const formatTimeScale = (value: number) => `${value}x`
