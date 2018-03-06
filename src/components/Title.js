// @flow
import React, {type Element} from 'react'
import './Title.css'

type Props = {
  children: Element<*>
}

const Title = ({children}: Props) => <div className="oom-title">{children}</div>

export default Title
