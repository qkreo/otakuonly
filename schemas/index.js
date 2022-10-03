const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://127.0.0.1/firstWeek")
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err);
});

// 게시글 리스트 조회
        // 게시글 제목
        // 게시글 작성자명
        // 게시글 작성날짜
        // 작성날짜 기준 내림차순 정렬해서 보내기

module.exports = connect;