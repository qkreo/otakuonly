
const express = require('express');
const router = express.Router();

const postsRouter = require("./posts"); // 포스트 라우터 경로
const goodsRouter = require("./goods"); // 굿즈 라우터 경로
const cartsRouter = require("./cart"); // 카트 라우터 경로

const Post = require("../schemas/post");// 포스트 스키마 경로

router.use([goodsRouter, cartsRouter]);  // 굿즈라우터 , 카트 라우터 사용

router.use("/posts", [postsRouter]); // 포스트 라우터 사용

// 게시글 전체 조회 API 
router.get("/", async (req, res) => { //GET 메소드 호출
  const posts = await Post.find().sort({created:-1}); // Post db에서 .find() 조건없이 전체 자료 호출 .sort({created:-1}) 작성날짜 기준 내림차순으로

  const post = posts.map((post) => { // 가져온 자료를 맵 함수 사용으로 객체 변수 새롭게 선언 객체값에서 필요한 값들만 빼서 넣는다 괄호 안 post 는 map 함수 내부에서만 쓸 변수
    title = post.title, 
    user = post.user,
    content = post.content,
    date = post.created,
    postid = post._id
    return {"title":title , "user":user , "content":content , "date":date , "postid":postid };
  });
  res.json({ post : post });
});

module.exports = router;