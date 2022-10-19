// controllers/posts.controller.js

const PostService = require('../services/posts.services');

class PostsController {
    postService = new PostService();
    // 전체 게시글 조회
    getPosts = async (req, res, next) => {
        try {
            const posts = await this.postService.findAllPost();

            res.status(200).json({ data: posts });
        } catch (err) {
            next(err);
        }
    };
    // 게시글 상세조회
    getPostById = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const post = await this.postService.findPostById(postId);

            res.status(200).json({ data: post });
        } catch (err) {
            next(err);
        }
    };
    // 게시글 작성
    createPost = async (req, res, next) => {
        try {
            const { title, content } = req.body;
            const { nickname, userId } = res.locals.user;
            const createPostData = await this.postService.createPost(
                nickname,
                userId,
                title,
                content
            );

            res.status(201).json({ data: createPostData });
        } catch (err) {
            next(err);
        }
    };
    // 게시글 수정
    updatePost = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { title, content } = req.body;
            const { nickname } = res.locals.user;

            const updatePost = await this.postService.updatePost(
                postId,
                nickname,
                title,
                content
            );

            res.status(200).json({ data: updatePost });
        } catch (err) {
            next(err);
        }
    };
    //게시글 삭제
    deletePost = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { nickname } = res.locals.user;

            const deletePost = await this.postService.deletePost(
                postId,
                nickname
            );

            res.status(200).json({ data: deletePost });
        } catch (err) {
            next(err);
        }
    };
    // 내 좋아요 게시글 조회
    myLikePosts = async (req, res, next) => {
        try {
            const { userId } = res.locals.user;

            const myLikePosts = await this.postService.myLikePosts(userId);

            res.status(200).json({ data: myLikePosts });
        } catch (err) {
            next(err);
        }
    };
    // 게시글 좋아요 누르기
    postLike = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { userId } = res.locals.user;

            const postLike = await this.postService.postLike(postId, userId);

            res.status(200).json({ data: postLike });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = PostsController;
