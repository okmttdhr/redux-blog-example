import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { savePost, fetchPost } from '../../actions/posts';
import PostEditor from '../../components/PostEditor/PostEditor';

@connect(state => ({
  user: state.auth,
  posts: state.posts.items
}), {
  savePost,
  fetchPost
})
export default class PostsEdit extends React.Component {
  static propTypes = {
    params: PropTypes.object,
    posts: PropTypes.object,
    savePost: PropTypes.func.isRequired
  }

  static fillStore(redux, props) {
    if (props.params.id) {
      return redux.dispatch(fetchPost(props.params.id));
    }
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  // 特定のポストを更新
  handleSave = (post) => {
    const router = this.context.router;
    this.props.savePost(post, router);
  }

  handlePublish = (post) => {
    // _extends({}, post, { published: true }) と同じ
    this.props.savePost({ ...post, published: true });
  }

  render() {
    let post;
    const { params: { id } } = this.props;

    if (id) {
      post = this.props.posts[id];
    } else {
      post = {
        title: '',
        content: ''
      };
    }

    return (
      <PostEditor
        post={post}
        onSave={this.handleSave}
        onPublish={this.handlePublish}
      />
    );
  }
}
