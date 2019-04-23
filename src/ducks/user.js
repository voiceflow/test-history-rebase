
import update from 'immutability-helper'

export const SET_PREVIEW = 'SET_PREVIEW'
export const CANVAS_ERROR = 'CANVAS_ERROR'
export const CLOSE_CANVAS_ERROR = 'CLOSE_CANVAS_ERROR'
export const SET_TAB = 'SET_TAB'
export const CLOSE_TAB = 'CLOSE_TAB'

const initialState = {
  preview: false,
  canvasError: [],
  tab: 'blocks',
  menuOpen: true,
}

export default function userReducer(state = initialState, action) {
  switch(action.type) {
      case SET_PREVIEW:
          return {
              ...state,
              preview: action.payload.preview
          }
      case CANVAS_ERROR:
          return {
              ...state,
              canvasError: update(state.canvasError, {$splice: [[0,1,action.payload.error]]})
          }
      case CLOSE_CANVAS_ERROR:
          return {
              ...state,
              canvasError: update(state.canvasError, {$splice: [[action.payload.idx, 1]]})
          }
      case SET_TAB:
          return {
              ...state,
              tab: action.payload.tab,
              menuOpen: true,
          }
      case CLOSE_TAB:
          return {
              ...state,
              menuOpen: false
          }
      default:
          return state
  }
}

export const setPreview = preview => ({
  type: SET_PREVIEW,
  payload: {preview}
})

export const setCanvasError = error => ({
  type: CANVAS_ERROR,
  payload: {error}
})

export const closeCanvasError = idx => ({
  type: CLOSE_CANVAS_ERROR,
  payload: [idx]
})

export const openTab = tab => ({
  type: SET_TAB,
  payload: {tab},
})

export const closeTab = () => ({
  type: CLOSE_TAB,
})
