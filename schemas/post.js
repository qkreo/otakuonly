const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    
  },
  user: {
    type: String,
    required: true,
    
  },

  password: {
    type: String,
    required: true,
    
  },
  content: {
    type: String,
    required: true,
    
  },
  created : {                  
    type : Date,
    default : Date.now
}                             

});


        // 게시글 제목
        // 작성자명
        // 작성 날짜
        // 작성당시 비밀번호 설정 > 암호화가 필요한가?
        // 작성 내용

module.exports = mongoose.model("post", postSchema);