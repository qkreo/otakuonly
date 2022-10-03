
const express = require('express');
const router = express.Router();

const Comment = require("../schemas/comment"); // 코멘트 스키마 경로

//댓글 전체보기 API
router.get("/", async (req, res) => { // get 메소드 현재 경로는 localhost:5000/index/posts/:_id/comments 상태임
    const comments = await Comment.find().sort({created:-1}); // Comment db의 내용물을 조건없이 다가져옴 . 날짜기준 내림차순 정렬
  
    const comment = comments.map((comment) => {     // 맵함수 사용 
      user = comment.user,
      content = comment.content,
      date = comment.created
      commentid = comment._id
      return {"user":user , "content":content , "date":date , "commentid":commentid };
    });   
    res.json({ comments : comment });   
  });

//"_id" : ObjectId("633866a7f81d9ea29ffe02d7"),
// 댓글 작성 API
router.post("/", async (req, res) => { //post 메소드 
	const { user, password, content } = req.body; // body 값들을 가져와서 구조분해

    if(content === ""){ // 가져온 컨텐츠 값이 공백일 경우 
        res.status(400).json({ errorMessage: "댓글 내용을 입력해주세요" }); // 에러메세지 출력
    }else{ // 컨텐츠에 값이 있는경우
        const createdcomment = await Comment.create({ user, password, content }); // Comment db에 저장과 동시에 변수에 선언
        res.json({ comment : createdcomment, msg:"댓글작성이 완료 되었습니다." });
    }
  
});

// 댓글 수정 API
// 6339b0f7582f34547238c834 비번 :1234
router.patch('/:comment_id', async (req,res) => { // patch 메소드  현재 경로는 localhost:5000/index/posts/:_id/comments/:comment_id 상태

    const { comment_id } = req.params; // 구조분해
    const { password , content , user  } = req.body; // 바디에서 가져온 값 구조분해    
    const comment = await Comment.find({"_id" : comment_id}); // db검색

    if(String(password) === comment[0].password){ // 비밀번호 비교 후 true 일시
        if (content === "") { // 컨텐츠가 공백일시
            res.status(400).json({ errorMessage: "댓글 내용을 입력해주세요" }); // 에러메세지 res
        } else { // 컨텐츠에 값이 있을경우 
            await Comment.updateOne({"_id" : comment_id},{ $set:{ content, user } }); // db 업데이트
            res.json({comment:comment, msg:"댓글수정이 완료 되었습니다."}); 
        }      
    } else {  // 비밀번호 비교 후 false 일시
        res.status(400).json({ errorMessage: "비밀번호가 다릅니다" });  // 에러메세지 출력    
    };
});

// 댓글 삭제 API
router.delete('/:comment_id', async (req,res) => { //delete 메소드
    const { comment_id } = req.params; // 동
    const { password } = req.body;    // 동
    const comment = await Comment.find({"_id" : comment_id}); // 동
    
    if(String(password) === comment[0].password){ // 비밀번호 비교
        await Comment.deleteOne({"_id" : comment_id}); // db에서 데이터삭제
        res.json({msg : "댓글 삭제가 완료 되었습니다."}); 
    } else { // 비밀번호 틀릴시
        res.status(400).json({ errorMessage: "비밀번호가 다릅니다" });  // 에러메세지 출력    
    };
    
});

module.exports = router;