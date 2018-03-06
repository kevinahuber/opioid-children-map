export const MOUSE_ENTER = 'key/MOUSE_ENTER'
export const MOUSE_LEAVE = 'key/MOUSE_LEAVE'
export const CLICK = 'key/CLICK'
export const CLEAR = 'key/CLEAR'

const initialState = {
  activeRange: null,
  clickedRange: null
}

export const NO_DATA = 'key/NO_DATA'
export type Range = [number, number] | NO_DATA
export default (state = initialState, {type, payload}) => {
  switch (type) {
    case CLEAR: {
      return {
        ...state,
        clickedRange: null
      }
    }
    case CLICK:
      return {
        ...state,
        clickedRange: payload.range
      }
    case MOUSE_ENTER:
      return {
        ...state,
        activeRange: payload.range
      }
    case MOUSE_LEAVE:
      return {
        ...state,
        activeRange: null
      }
    default:
      return state
  }
}

export const clear = _ => {
  return dispatch => {
    dispatch({
      type: CLEAR
    })
  }
}

export const click = range => {
  return dispatch => {
    dispatch({
      type: CLICK,
      payload: {
        range
      }
    })
  }
}

export const mouseEnter = range => {
  return dispatch => {
    dispatch({
      type: MOUSE_ENTER,
      payload: {
        range
      }
    })
  }
}

export const mouseLeave = _ => {
  return dispatch => {
    dispatch({
      type: MOUSE_LEAVE
    })
  }
}
