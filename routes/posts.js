const express = require('express');
const router = express.Router();

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

const authMiddleware = require('../middlewares/auth-middleware'); // 인증 미들웨어
// 게시글 전체 조회 API
router
    .route('/')
    // 전체 게시글 보기
    .get(postsController.getPosts)
    // 게시글 작성 API
    .post(authMiddleware, postsController.createPost);

router
    .route('/:postId')
    // 게시글 상세 조회 API
    .get(postsController.getPostById)
    // 게시글 수정 API
    .patch(authMiddleware, postsController.updatePost)
    // 게시글 삭제 API
    .delete(authMiddleware, postsController.deletePost);

// 내 좋아요 게시글 조회 API
router.post('/myLikes', authMiddleware, postsController.myLikePosts);

// 상세 게시글 좋아요 누르기
router.put('/:postId/like', authMiddleware, postsController.postLike);

module.exports = router;
