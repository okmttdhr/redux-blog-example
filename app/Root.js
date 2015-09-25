/* eslint-env browser */
/* global process */
import React from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import cookie from './utils/cookie';

// ルートとコンポーネントの紐付けを定義
import routes from './routes';

import { routerStateChange } from './actions/router';
import { createRedux } from './utils/redux';

// process.env.NODE_ENV === 'production'ならwindow.__INITIAL_STATE__をセット
const store = createRedux((process.env.NODE_ENV === 'production')
  ? window.__INITIAL_STATE__
  : { auth: { token: cookie.get('token') || '' } });

export default class Root extends React.Component {
  static propTypes = {

    // propsにhistoryがある
    history: React.PropTypes.object.isRequired

  }

  render() {
    return (
      <Provider store={store}>{() => (
        <Router
          history={this.props.history}
          routes={routes(store, true)}

          onUpdate={function() {

            // app/actions/router.jsを使用
            // stateのアップデートを検知して更新
            store.dispatch(routerStateChange(this.state));

          }}
        />
      )}</Provider>
    );
  }
}
