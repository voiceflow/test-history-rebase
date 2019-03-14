export const setPreview = preview => ({
    type: "SET_PREVIEW",
    payload: {preview}
})

export const setCanvasError = error => ({
    type: "CANVAS_ERROR",
    payload: {error}
})

export const closeCanvasError = idx => ({
    type: "CLOSE_CANVAS_ERROR",
    payload: [idx]
})

export const SET_PREVIEW = 'SET_PREVIEW'
export const CANVAS_ERROR = 'CANVAS_ERROR'
export const CLOSE_CANVAS_ERROR = 'CLOSE_CANVAS_ERROR'