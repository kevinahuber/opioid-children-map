// @flow

import React, {Component, type Node} from 'react'
import styles from './Key.css'
import {scaleLinear} from 'd3-scale'
import {connect} from 'react-redux'
import cn from 'classnames'
import {mouseEnter, mouseLeave, click, NO_DATA} from '../modules/key.js'
import {bindActionCreators} from 'redux'

const NUM_BLOCKS = 10

export type Data = {
  [string]: number,
  Ohio: number
}

export type Domain = [number, number, number]

export const findDomain = (data: Data): Domain => {
  const values = Object.values(data).filter(d => typeof d === 'number')

  // $FlowFixMe: refinement does not work.
  const max = Math.ceil(Math.max(...values) / 5) * 5
  // $FlowFixMe: refinement does not work.
  const min = Math.floor(Math.min(...values) / 5) * 5

  return [min, (max + min) / 2, max]
}

const popScale = scaleLinear()
  .domain([NUM_BLOCKS, 0])
  .range([styles.tertiary, styles.primary])

const AverageLine = ({value, label}: {value: number, label: Node}) => {
  return (
    <div
      className="oom-key__line oom-key__line--average"
      style={{top: `${value}%`}}
    >
      <div className="oom-key__line-graticule" />
      <div className="oom-key__line-label">{label}</div>
    </div>
  )
}
const Line = ({value, label}: {value: number, label: Node}) => {
  return (
    <div className={cn('oom-key__line')} style={{top: `${value}%`}}>
      <div className="oom-key__line-caret" />
      <div className="oom-key__line-label">{label}</div>
    </div>
  )
}

type LinesProps = {
  data: Data,
  activeCounty?: string,
  activeRange?: [number, number]
}

const Lines = ({data, activeCounty, activeRange}: LinesProps) => {
  const domain = findDomain(data)

  const popPosition = scaleLinear()
    .domain(domain)
    .range([100, 50, 0])

  return (
    <div className="oom-key__lines">
      {data.USA && (
        <AverageLine
          value={popPosition(data.USA)}
          label={`US Average: ${data.USA}`}
        />
      )}
      {data.Ohio && (
        <AverageLine
          value={popPosition(data.Ohio)}
          label={`Ohio Average: ${data.Ohio}`}
        />
      )}
      {activeCounty &&
        data[activeCounty] !== null && (
          <Line
            value={popPosition(data[activeCounty])}
            label={`${activeCounty}: ${data[activeCounty]}`}
          />
        )}
      {activeRange &&
        activeRange !== NO_DATA && (
          <Line
            value={
              (popPosition(activeRange[0]) + popPosition(activeRange[1])) / 2
            }
            label={`${activeRange[1].toFixed(1)} - ${activeRange[0].toFixed(
              1
            )}`}
          />
        )}
    </div>
  )
}

type Range = [number, number]

type KeyProps = {
  data: Data,
  activeCounty?: string,
  activeRange?: Range,
  clickedRange?: Range,
  mouseEnter: Range => void,
  mouseLeave: () => void,
  click: Range => void
}

class Key extends Component<KeyProps> {
  handleMouseEnter = (range: Range) => () => {
    this.props.mouseEnter(range)
  }

  handleClick = (range: Range) => () => {
    this.props.click(range)
  }

  render() {
    const {data, activeCounty, activeRange, mouseLeave} = this.props
    const blocks = []
    const domain = findDomain(data)

    const popRange = scaleLinear()
      .domain([NUM_BLOCKS, Math.floor(NUM_BLOCKS / 2), 0])
      .range(domain)

    for (let i = 0; i < NUM_BLOCKS; i++) {
      const range = [popRange(i), popRange(i + 1)]
      const handleMouseEnter = this.handleMouseEnter(range)
      const handleClick = this.handleClick(range)
      blocks.push(
        <div
          key={i}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={mouseLeave}
          className="oom-key__block"
          style={{background: popScale(i)}}
        />
      )
    }

    const hasNoData = !!Object.keys(data).find(k => data[k] === null)
    return (
      <div className="oom-key">
        <div
          className={cn('oom-key__values', {
            'oom-key__values--full-data': !hasNoData
          })}
        >
          {blocks}
          <Lines
            data={data}
            activeCounty={activeCounty}
            activeRange={activeRange}
          />
        </div>
        {hasNoData && (
          <div
            className="oom-key__block oom-key__block--no-data"
            onMouseEnter={this.handleMouseEnter(NO_DATA)}
            onMouseLeave={mouseLeave}
          >
            {activeRange === NO_DATA && <Line label="No Data" value={50} />}
            {activeCounty &&
              data[activeCounty] === null && (
                <Line label={`${activeCounty}: No Data`} value={50} />
              )}
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  activeCounty: state.map.activeCounty,
  activeRange: state.key.clickedRange || state.key.activeRange,
  clickedRange: state.key.clickedRange
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      mouseEnter,
      mouseLeave,
      click
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Key)
