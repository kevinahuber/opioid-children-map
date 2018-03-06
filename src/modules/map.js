export const MOUSE_ENTER = 'map/MOUSE_ENTER'
export const MOUSE_LEAVE = 'map/MOUSE_LEAVE'

const initialState = {
  activeCounty: null
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case MOUSE_ENTER:
      return {
        ...state,
        activeCounty: payload.county
      }
    case MOUSE_LEAVE:
      return {
        ...state,
        activeCounty: null
      }
    default:
      return state
  }
}

export const mouseEnter = county => {
  return dispatch => {
    dispatch({
      type: MOUSE_ENTER,
      payload: {
        county
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
