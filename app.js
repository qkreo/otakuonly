const express = require('express');
const app = express();
const port = 5000;

const postsRouter = require("./middlewares/posts"); // 포스트 라우터 경로
const indexRouter = require("./middlewares/index"); // 인덱스 라우터 경로

app.use(express.json()); // 모든코드에서 body parser 를 등록해서 전역에 사용한다

app.use("/",indexRouter);  // 인덱스 라우터 사용
app.use("/post", [postsRouter]); // 포스트 라우터 사용

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
