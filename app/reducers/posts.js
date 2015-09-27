import {
  FETCH_POSTS_SUCCESS,
  FETCH_POST_SUCCESS,
  SAVE_POST_SUCCESS
} from '../constants/actions';

export default (state = { list: [], items: {} }, action) => {

  console.log('posts state');
  console.log(state);

  switch (action.type) {

    // ポストを取得、オブジェクト(state)をセット
    case FETCH_POSTS_SUCCESS:
      const list = action.posts.map(item => item.id);
      const items = {};

      action.posts.forEach(post => { items[post.id] = post; });

      return { list, items };

    case SAVE_POST_SUCCESS:

    // 特定のポストを取得
    case FETCH_POST_SUCCESS:
      return {

        // items: {... は以下と同じ。
        // function _defineProperty(obj, key, value) {
        //   if (key in obj) {
        //     Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
        //   } else {
        //     obj[key] = value;
        //   }
        //   return obj;
        // }
        //
        // items: _extends({},
        //   state.items,
        //   _defineProperty({},
        //     action.post.id,
        //     action.post
        //   )
        // ),
        items: {
          ...state.items,
          [action.post.id]: action.post
        },

        list: state.list
      };

    default:
      return state;
  }
};
