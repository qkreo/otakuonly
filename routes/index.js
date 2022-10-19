const express = require('express');
const router = express.Router();

const commentRouter = require('./comment'); // 코멘트 라우터 경로
const postsRouter = require('./posts'); // 포스트 라우터 경로
const userRouter = require('./users') // 유저 라우터 경로

router.use('/post', [postsRouter, commentRouter]); // 포스트 라우터 사용
router.use('/users', [userRouter]); // 포스트 라우터 사용

//인트로
router.get('/', (req, res) => {
    res.json({"msg":"접속을 환영합니다",
    "/post/:postId":"상세게시글 보기",
    "/post/:postId/comments":"전체 댓글보기",
    "/post/:postId/comments/comments_id":"상세게시글",
    "/post/:postId/like":"해당게시글에 좋아요 누르기 및 취소",
    "/post/like":"내가 좋아요한 게시글 보기 "});
  });

module.exports = router;