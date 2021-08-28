// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import axios from 'axios';

import App from './../components/App'
import reducers from './../reducers';
import {signInWithJWT} from "../actions/user";
import {FETCH_USER} from "../actions";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(reduxThunk)));

const authorization = localStorage.getItem('authorization');
if (authorization) {
    axios.defaults.headers.common['authorization'] = authorization;
    store.dispatch(signInWithJWT(authorization));
} else {
    store.dispatch({type: FETCH_USER, payload: null});
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.body.appendChild(document.createElement('div')),
  )
})
