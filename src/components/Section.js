// @flow
import React, {Component, type Node} from 'react'
import cn from 'classnames'
import './Section.css'
import Sources, {type Source} from './Sources.js'

type Props = {
  children: Node,
  sources: Source[]
}

type State = {
  isSourcesExpanded: boolean
}

class Section extends Component<Props, State> {
  state: State = {
    isSourcesExpanded: false
  }

  handleSourcesExpand = () => {
    this.setState((state: State) => ({
      isSourcesExpanded: !state.isSourcesExpanded
    }))
  }
  render() {
    const {children, sources} = this.props
    const {isSourcesExpanded} = this.state

    return (
      <div className="oom-section__container">
        <section
          className={cn('oom-section', {
            'oom-section--expanded': isSourcesExpanded
          })}
        >
          {children}
        </section>
        <Sources
          sources={sources}
          isExpanded={isSourcesExpanded}
          onExpand={this.handleSourcesExpand}
        />
      </div>
    )
  }
}

export default Section
