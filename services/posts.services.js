// services/posts.services.js

const PostRepository = require('../repositories/posts.repository');

class PostService {
    postRepository = new PostRepository();

    findAllPost = async () => {
        const allPost = await this.postRepository.findAllPost();

        return allPost;
    };

    findPostById = async (postId) => {
        const findPost = await this.postRepository.findPostById(postId);

        return findPost;
    };

    createPost = async (nickname, userId, title, content) => {
        const createPostData = await this.postRepository.createPost(
            nickname,
            userId,
            title,
            content
        );

        return createPostData;
    };

    updatePost = async (postId, nickname, title, content) => {
        const [updatePost] = await this.postRepository.updatePost(
            postId,
            nickname,
            title,
            content
        );
        if (updatePost) {
            return '게시글 수정이 완료';
        } else {
            throw new Error('게시글 수정 권한이 없으시군요 게시글이없거나');
        }
    };

    deletePost = async (postId, nickname) => {
        const deletePost = await this.postRepository.deletePost(
            postId,
            nickname
        );

        if (deletePost) {
            return '게시글 파괴 완료;;';
        } else {
            throw new Error('게시글 삭제 권한이 없으시군요 게시글이없거나');
        }
    };

    myLikePosts = async (userId) => {
        const mylikePosts = await this.postRepository.myLikePosts(userId);

        if (mylikePosts.length === 0) {
            return '아직 좋아요를 누르지않으셨군요..';
        } else {
            return mylikePosts;
        }
    };
    
    postLike = async (postId, userId) => {
        const findLike = await this.postRepository.findLike(postId, userId);

        if (!findLike) {
            const upLike = await this.postRepository.upLike(postId, userId);
            return upLike,"좋아요를 등록하였습니다"; // [[null,1]]
        } else {
            const downLike = await this.postRepository.downLike(postId, userId);
            return downLike,"좋아요를 취소하였습니다"; // [[null,1]]
        }
    };
}

module.exports = PostService;
