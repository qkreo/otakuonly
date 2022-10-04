const express = require('express');
const app = express();
const port = 5000;

const indexRouter = require("./routes/index"); //인덱스 라우터 경로
const connect = require("./schemas"); // 스키마 연결
connect(); // 스키마연결 함수 실행

app.use(express.json()); // 모든코드에서 body parser 를 등록해서 전역에 사용한다

app.get('/', (req, res) => {
  res.send("대문 / 입장하기?");    
});

app.use("/index",[indexRouter]); // 인덱스 라우터 사용
  
app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
