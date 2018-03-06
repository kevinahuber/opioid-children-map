// @flow

import React, {Component, type Node} from 'react'
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from 'react-simple-maps'
import geographies from '../resources/ohio-counties.json'
import {Tooltip, actions} from '@kevinahuber/redux-tooltip'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {scaleLinear} from 'd3-scale'
import Key, {findDomain, type Data} from './Key.js'
import {mouseEnter, mouseLeave} from '../modules/map.js'
import {clear, NO_DATA} from '../modules/key.js'
import styles from './Map.css'

const {show, hide} = actions
const BASE_WIDTH = 380

type Tip = {
  origin: {x: number, y: number},
  content: Node
}

type Props = {
  show: Tip => void,
  hide: () => void,
  mouseEnter: string => void,
  mouseLeave: string => void,
  data: Data,
  activeRange: [number, number],
  clear: () => void,
  clickedRange: [number, number]
}

type State = {
  hasPointer: boolean,
  isOptimizationDisabled: boolean,
  mapWidth?: number
}

class Map extends Component<Props, State> {
  state: State = {
    hasPointer: false,
    isOptimizationDisabled: true
  }
  _ref = null

  componentDidMount() {
    // HACK: To handle devices with no hover abilities.
    const hasPointer = window.matchMedia('(pointer: fine)').matches
    const mapWidth = this._ref
      ? Math.min(this._ref.offsetWidth, BASE_WIDTH)
      : BASE_WIDTH
    this.setState({hasPointer, mapWidth, isOptimizationDisabled: true})
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.compareRange('activeRange', this.props, nextProps) ||
      this.compareRange('clickedRange', this.props, nextProps) ||
      this.props.data.Ohio !== nextProps.data.Ohio
    ) {
      this.setState({isOptimizationDisabled: true})
    }
  }

  setRef = r => {
    this._ref = r
  }

  compareRange(name, props, nextProps) {
    return (
      ((!props[name] ||
        !nextProps[name] ||
        props[name] === NO_DATA ||
        nextProps[name] === NO_DATA) &&
        props[name] !== nextProps[name]) ||
      (props[name] &&
        nextProps[name] &&
        props[name].length &&
        nextProps[name].length &&
        (props[name][0] !== nextProps[name][0] ||
          props[name][1] !== nextProps[name][1]))
    )
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.isOptimizationDisabled) {
      this.setState((state: State) => ({isOptimizationDisabled: false}))
    }
  }

  handleMove = (geography, evt) => {
    const x = evt.clientX - 45
    const y = evt.clientY + window.pageYOffset - 120
    const content = this.renderTooltip(geography)

    this.props.mouseEnter(geography.properties.NAME)
    this.props.show({
      origin: {x, y},
      content
    })
  }

  handleLeave = geography => {
    this.props.mouseLeave(geography.properties.NAME)
    this.props.hide()
  }

  renderTooltip = geography => {
    const {data} = this.props
    const local = data[geography.properties.NAME]
    const state = data.Ohio
    const stateDiff = local - state
    const national = data.USA
    const nationalDiff = local - national
    return (
      <div>
        <div>
          {geography.properties.NAME}: {local || 'No Data'}
        </div>
        {state && (
          <div>
            Ohio: {state}
            {local && (
              <span
                className={
                  stateDiff > 0
                    ? 'oom-map__tooltip-positive'
                    : stateDiff < 0
                      ? 'oom-map__tooltip-negative'
                      : 'oom-map__tooltip-neutral'
                }
              >
                {stateDiff.toFixed(1)}
              </span>
            )}
          </div>
        )}
        {national && (
          <div>
            US: {national}
            {local && (
              <span
                className={
                  nationalDiff > 0
                    ? 'oom-map__tooltip-positive'
                    : nationalDiff < 0
                      ? 'oom-map__tooltip-negative'
                      : 'oom-map__tooltip-neutral'
                }
              >
                {nationalDiff.toFixed(1)}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
  render() {
    const {data, activeRange, clickedRange, clear} = this.props
    const {hasPointer, isOptimizationDisabled, mapWidth} = this.state
    const domain = findDomain(data)
    const popScale = scaleLinear()
      .domain([domain[0], domain[2]])
      .range([styles.tertiary, styles.primary])

    const onClick = hasPointer
      ? clickedRange && (!activeRange || clickedRange[0] === activeRange[0])
        ? clear
        : null
      : clear

    const range = clickedRange || activeRange

    const zoom = mapWidth ? mapWidth / BASE_WIDTH : 1
    const width = mapWidth ? mapWidth.toString() : BASE_WIDTH.toString()
    const height = mapWidth
      ? (mapWidth * 1.07).toString()
      : (BASE_WIDTH * 1.07).toString()

    const isNoData = range === NO_DATA

    const activeCounties = new Set(
      Object.keys(data).filter(d => {
        const value = data[d]
        return (
          !range ||
          (isNoData
            ? value === null
            : range &&
              typeof value === 'number' &&
              value >= range[1] &&
              value <= range[0])
        )
      })
    )
    return (
      <div className="oom-map" onClick={onClick} ref={this.setRef}>
        <Tooltip className="oom-map__tooltip" />
        <div className="oom-map__map">
          {range &&
            !activeCounties.size && (
              <div className="oom-map__warning--no-counties">
                No counties within range
              </div>
            )}
          {mapWidth && (
            <ComposableMap
              projection="mercator"
              width={width}
              height={height}
              projectionConfig={{
                scale: 4980
              }}
              style={{
                stroke: styles.border,
                strokeWidth: 1
              }}
              defs={
                <pattern
                  id="stripes"
                  patternUnits="userSpaceOnUse"
                  width="10"
                  height="10"
                >
                  <image
                    xlinkHref="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JzEnLz4KPC9zdmc+Cg=="
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                  />
                </pattern>
              }
            >
              <ZoomableGroup
                center={[-82.67, 40.21]}
                zoom={zoom}
                disablePanning
              >
                <Geographies
                  geography={geographies}
                  disableOptimization={isOptimizationDisabled}
                >
                  {(geographies, projection) =>
                    geographies.map((geography, key) => {
                      const value = data[geography.properties.NAME]
                      const primaryColor =
                        typeof value === 'number'
                          ? popScale(value)
                          : 'url(#stripes)'
                      const opacity = activeCounties.has(
                        geography.properties.NAME
                      )
                        ? 1
                        : 0.2

                      return (
                        <Geography
                          key={key}
                          geography={geography}
                          projection={projection}
                          onMouseMove={this.handleMove}
                          onMouseLeave={this.handleLeave}
                          style={{
                            default: {
                              fill: primaryColor,
                              outline: 'none',
                              fillOpacity: opacity,
                              strokeOpacity: opacity,
                              transition: 'all 200ms ease-in-out'
                            },
                            hover: {
                              fill: primaryColor,
                              fillOpacity: 0.7,
                              outline: 'none'
                            },
                            pressed: {
                              outline: 'none'
                            }
                          }}
                        />
                      )
                    })}
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          )}
        </div>
        <Key data={data} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  activeRange: state.key.activeRange,
  clickedRange: state.key.clickedRange
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      show,
      hide,
      mouseEnter,
      mouseLeave,
      clear
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Map)
