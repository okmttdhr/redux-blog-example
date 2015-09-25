/* eslint-env commonjs */
/* global process */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { ROUTER_STATE_CHANGE } from '../constants/actions';

// 唯一 reducer を呼び出して、初期 state を作成している
import reducer from '../reducers';

// storeをつくる
// initialStateは Root.js か server.js からわたってくる
export function createRedux(initialState) {
  const middleware = [thunk];

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger({
      collapsed: true,
      predicate: (getState, action) => !(action.type === ROUTER_STATE_CHANGE)
    }));
  }

  console.log(initialState);

  // #todo reducer, initialStateをセット？
  const finalCreateStore = applyMiddleware(...middleware)(createStore);
  const store = finalCreateStore(reducer, initialState);

  // webpack hot reload のため
  if (module.hot) {
    const nextReducer = require('../reducers');
    module.hot.accept('../reducers',
      () => { store.replaceReducer(nextReducer); });
  }

  return store;
}
