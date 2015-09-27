import {
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,

  FETCH_POST_SUCCESS,
  FETCH_POST_FAILURE,

  SAVE_POST_SUCCESS,
  SAVE_POST_FAILURE
} from '../constants/actions';

import axios from 'axios';
import getHeaders from '../utils/getHeaders';

const baseUrl = 'http://localhost:1337';

export function fetchPosts() {
  return async (dispatch) => {
    try {

      // よくはわからないけど、jsonServer使うこともないだろうし、完璧にわからなくてもいいだろう。
      // 自分でやる時は、ちゃんと普通のエンドポイントつくってやろう
      const posts = (await axios.get(`${baseUrl}/posts`)).data;

      dispatch({ type: FETCH_POSTS_SUCCESS, posts });

    } catch (error) {
      dispatch({
        type: FETCH_POSTS_FAILURE,
        error: Error('Unknown error occured :-(. Please, try again later.')
      });
    }
  };
}

// 特定のポストを取得
export function fetchPost(id) {
  return async (dispatch, getState) => {
    try {

      // 以下と同じ
      // var _getState = getState();
      // var token = _getState.auth.token;
      const { auth: { token } } = getState();

      const headers = getHeaders(token);

      // #todo これはexpressがデフォでルートをセットしてくれてるからできるのかなあ・・・？
      // 謎だ。どこにもコードが書いてないのに。
      const post = (await axios.get(`${baseUrl}/posts/${id}`, {
        headers
      })).data;

      dispatch({ type: FETCH_POST_SUCCESS, post });

    } catch (error) {
      dispatch({
        type: FETCH_POST_FAILURE,
        error: Error('Unknown error occured :-(. Please, try again later.')
      });
    }
  };
}

export function savePost(post, router) {
  return async (dispatch, getState) => {
    try {
      const { auth: { token } } = getState();

      let headers = getHeaders(token);

      // #todo これもexpressがデフォでやってくれてるのかなあ。
      if (post.id) {

        // 特定のポストを更新
        post = (await axios.put(`${baseUrl}/posts/${post.id}`, post, {
          headers
        })).data;

      } else {

        // ポストすべてを更新
        // 現状こちらは使われていない
        post = (await axios.post(`${baseUrl}/posts`, post, { headers })).data;

      }

      dispatch({ type: SAVE_POST_SUCCESS, post });

      if (router) {
        router.transitionTo('/dashboard');
      }

    } catch (error) {
      dispatch({
        type: SAVE_POST_FAILURE,
        error: Error('Unknown error occured :-(. Please, try again later.')
      });
    }
  };
}
