export type Modifiers = {
    shift: boolean
}

export type Pointer = {
    isActive: boolean
    st: number
    sx: number
    sy: number
    t: number
    x: number
    y: number
    modifiers: Modifiers
}
