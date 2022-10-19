// services/posts.services.js

const PostRepository = require('../repositories/posts.repository');

class PostService {
    postRepository = new PostRepository();

    findAllPost = async () => {
        const allPost = await this.postRepository.findAllPost();

        if (allPost) {
            return allPost;
        } else {
            throw new Error('포스트를 불러오는 중 에러가 발생했습니다');
        }
    };

    findPostById = async (postId) => {
        const findPost = await this.postRepository.findPostById(postId);

        if (findPost) {
            return findPost;
        } else {
            throw new Error('게시글을 불러오는 중 에러가 발생했습니다');
        }
    };

    createPost = async (nickname, userId, title, content) => {
        const createPostData = await this.postRepository.createPost(
            nickname,
            userId,
            title,
            content
        );
        if (createPostData) {
            return createPostData;
        } else {
            throw new Error('포스트를 저장하는 중 에러가 발생했습니다');
        }
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
            throw new Error('아직 좋아요를 누르지않으셨군요..');
        } else {
            return mylikePosts;
        }
    };

    postLike = async (postId, userId) => {
        const findLike = await this.postRepository.findLike(postId, userId);

        if (!findLike) {
            const upLike = await this.postRepository.upLike(postId, userId);
            if (upLike[0][1] === 1) {
                return upLike, '좋아요를 등록 하였습니다'; // [[null,1]]
            } else {
                throw new Error('좋아요 등록 중 에러가 발생했습니다');
            }
        } else {
            const downLike = await this.postRepository.downLike(postId, userId);
            if (downLike[0][1] === 1) {
                return downLike, '좋아요를 취소 하였습니다'; // [[null,1]]
            } else {
                throw new Error('좋아요 등록 중 에러가 발생했습니다');
            }
        }
    };
}

module.exports = PostService;
