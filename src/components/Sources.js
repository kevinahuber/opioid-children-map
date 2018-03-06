// @flow

import React, {Component} from 'react'
import cn from 'classnames'
import './Sources.css'

export type Source = {
  label: string,
  url: string
}

type Props = {
  sources: Source[],
  isExpanded: boolean,
  onExpand: () => mixed
}

class Sources extends Component<Props> {
  renderSource = (source: Source, i: number) => (
    <a
      target="_blank"
      key={i}
      href={source.url}
      rel="noopener noreferrer"
      className="sources__source"
    >
      <div className="sources__source-label">{source.label}</div>
      <div className="sources__source-url">{source.url}</div>
    </a>
  )
  render() {
    const {sources, isExpanded, onExpand} = this.props
    return (
      <div>
        <div className={cn('sources', {'sources--expanded': isExpanded})}>
          <div className="sources__modal">
            <div className="sources__quote-top">“</div>
            <div className="sources__quote-bottom">”</div>
            <div className="sources__title">Sources</div>
            <div className="sources__body">
              {sources.map(this.renderSource)}
            </div>
          </div>
          <div className="sources__link" onClick={onExpand}>
            {isExpanded ? 'Close' : 'Sources'}
          </div>
        </div>
        <div
          onClick={onExpand}
          className={cn('sources__overlay', {
            'sources__overlay--expanded': isExpanded
          })}
        />
      </div>
    )
  }
}

export default Sources
