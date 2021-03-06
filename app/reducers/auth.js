import {
  ROUTER_STATE_CHANGE,

  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  // 現時点で、SIGNUP_SUCCESSの機能は実装されていない
  SIGNUP_FAILURE,

  LOGOUT,

  SAVE_PROFILE,
  SAVE_PROFILE_SUCCESS,
  FETCH_PROFILE_SUCCESS
} from '../constants/actions';

const initialState = {
  error: null, // last occured error
  token: null,
  profile: null
};

export default (state = initialState, action) => {

  console.log('auth state');
  console.log(state);

  switch (action.type) {
    case ROUTER_STATE_CHANGE:
      return {
        ...state,
        error: null
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        error: null,
        token: action.token
      };

    case SIGNUP_FAILURE:
    case LOGIN_FAILURE:
      return {
        ...state,
        error: action.error
      };

    case LOGOUT:
      return { ...initialState };

    case SAVE_PROFILE:
    case SAVE_PROFILE_SUCCESS:
    case FETCH_PROFILE_SUCCESS:

      // 以下と同じ。くっつけてるだけ。
      // return _extends({}, state, {
      //   profile: _extends({}, state.profile, action.user),
      //   error: null
      // });
      return {
        ...state,
        profile: { ...state.profile, ...action.user },
        error: null
      };

    default:
      return state;
  }
};
