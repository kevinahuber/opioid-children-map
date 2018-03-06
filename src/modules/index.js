// @flow
import {combineReducers} from 'redux'
import {reducer as tooltip} from '@kevinahuber/redux-tooltip'
import {routerReducer} from 'react-router-redux'
import map from './map.js'
import key from './key.js'

export default combineReducers({routing: routerReducer, tooltip, map, key})
