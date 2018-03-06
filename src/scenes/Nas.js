// @flow
import React, {Component} from 'react'
import Map from '../components/Map.js'
import data from '../resources/ohio-counties-nas.json'
import Title from '../components/Title.js'
import Subtitle from '../components/Subtitle.js'
import {Nas as content} from '../resources/content.json'
import Section from '../components/Section.js'

class Nas extends Component<{}> {
  render() {
    return (
      <div className="oom-nas">
        <Section sources={content.sources}>
          <Title>{content.title}</Title>
          <Subtitle>{content.subtitle}</Subtitle>
          <Map data={data} />
        </Section>
      </div>
    )
  }
}

export default Nas
