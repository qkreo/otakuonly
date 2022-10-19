const express = require('express');
const router = express.Router();

const CommentsController = require('../controllers/comments.controller');
const commentsController = new CommentsController();

const authMiddleware = require('../middlewares/auth-middleware'); // 인증 미들웨어

//댓글 전체보기 API
router.route("/:postId/comments")
    // .get(commentsController.getComments) // 기능 불필요로 삭제
// 댓글 작성 API
    .post(authMiddleware,commentsController.createComment)

//댓글 수정 API
router.route('/:postId/comments/:commentId')
    .patch(authMiddleware,commentsController.updateComment)
// 댓글 삭제 API
    .delete(authMiddleware,commentsController.deleteComment)

module.exports = router;