import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import Nas from './Nas.js'
import Foster from './Foster.js'
import Opioid from './Opioid.js'
const App = () => (
  <div>
    <main>
      <Route exact path="/" component={() => <Redirect to="/nas" />} />
      <Route exact path="/nas" component={Nas} />
      <Route exact path="/foster" component={Foster} />
      <Route exact path="/opioid" component={Opioid} />
    </main>
  </div>
)

export default App
