
const express = require('express');
const router = express.Router();

const { comments } = require("../models"); // mysql  유저 스키마 모듈

const authMiddleware = require("./auth-middleware"); // 인증 미들웨어

//댓글 전체보기 API
router.get("/:postId/comments", async (req, res) => { 
    const { postId } = req.params

    const commentlists = await comments.findAll({ where: { postId} ,attributes:{ exclude:["postId"] } });
    commentlists.sort(function(a, b){return b.updatedAt - a.updatedAt});
      
    res.json({ comments : commentlists });   
});

// 댓글 작성 API
router.post("/:postId/comments",authMiddleware, async (req, res) => { //post 메소드 
    const { postId } = req.params;
	const { content } = req.body;
    const { nickname } = res.locals.user;

    if(content === ""){ // 가져온 컨텐츠 값이 공백일 경우 
        res.status(400).json({ errorMessage: "댓글 내용을 입력해주세요" }); // 에러메세지 출력

    } else { // 컨텐츠에 값이 있는경우
        const writecomment = await comments.create({ postId, content, nickname }); // Comment db에 저장과 동시에 변수에 선언
        res.json({ comment : writecomment, msg:"댓글작성이 완료 되었습니다." });
    }
});

//댓글 수정 API
router.patch('/:postId/comments/:commentId',authMiddleware, async (req,res) => {

    const { commentId } = req.params; 
    const { content } = req.body; 
    const { nickname } = res.locals.user;
       
        if (content === "") { // 컨텐츠가 공백일시
            res.status(400).json({ errorMessage: "댓글 내용을 입력해주세요" }); // 에러메세지 res
            
        } else if (content) { // 컨텐츠에 값이 있을경우 
            const [updatePost] = await comments.update({ content } , { where: { commentId,nickname } });

            if (updatePost) {
                res.json({msg:"댓글수정이 완료 되었습니다."});
            }  else {
                res.json({errormsg:"댓글을 찾지 못했거나, 작성자가 아닙니다"});
            }       
        } 
});

// 댓글 삭제 API
router.delete('/:postId/comments/:commentId', authMiddleware, async (req,res) => { //delete 메소드
    const { commentId } = req.params; // 구조분해
    const { nickname } = res.locals.user;
    
        try {
            await comments.destroy({where: { commentId,nickname }}); // db에서 데이터삭제      
            res.json({msg : "댓글 삭제가 완료 되었습니다."}); 
        } catch(err) {
            res.json({errormsg : "댓글을 찾지 못했거나, 작성자가 아닙니다"}); 
        }     
});

module.exports = router;