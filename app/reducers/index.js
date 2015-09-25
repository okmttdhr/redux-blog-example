import { combineReducers } from 'redux';
import auth from './auth';
import router from './router';
import posts from './posts';

// 以下の様なオブジェクトを生成する
// {
//   auth: {
//     error: null,
//     token: null,
//     profile: null
//   },
//   router: {
//
//   },
  // posts: {
  //   items: {}
  //   list: []
  // }
// }
export default combineReducers({
  auth,
  router,
  posts
});
