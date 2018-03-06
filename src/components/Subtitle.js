// @flow
import React, {type Element} from 'react'
import './Subtitle.css'

type Props = {
  children: Element<*>
}

const Subtitle = ({children}: Props) => (
  <div className="oom-subtitle">{children}</div>
)

export default Subtitle
