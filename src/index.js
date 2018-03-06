import React from 'react'
import {render} from 'react-dom'
import './index.css'
import {unregister as unregisterServiceWorker} from './registerServiceWorker'
import {Provider} from 'react-redux'
import {ConnectedRouter} from 'react-router-redux'
import store, {history} from './store.js'
import App from './scenes/App.js'
const target = document.querySelector('#root')

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>,
  target
)
unregisterServiceWorker()
