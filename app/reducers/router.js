import {
  ROUTER_STATE_CHANGE
} from '../constants/actions';

export default (state = null, action) => {

  console.log('router state');
  console.log(state);

  switch (action.type) {
    case ROUTER_STATE_CHANGE:
      return action.state;

    default:
      return state;
  }
};
