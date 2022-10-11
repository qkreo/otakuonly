
const express = require('express');
const router = express.Router();

const { likes, posts, sequelize } = require("../models"); // mysql 스키마 모듈

const authMiddleware = require("./auth-middleware"); // 미들웨어
const commentRouter = require("./comment"); // 코멘트 라우터 경로

router.use('/', [commentRouter]); //코멘트 라우터 사용

// 게시글 전체 조회 api
router.get("/", async (req, res) => { //GET 메소드 호출
    const postlists = await posts.findAll( {attributes:{ exclude:["content"] } } ); // 조회조건 추가 해보기 필터링
    
    res.json({ post : postlists });
  });
    
// 내 좋아요 게시글 조회 API 
router.post('/like', authMiddleware, async (req, res) => { 
    const { userId } = res.locals.user;
    const [result] = await sequelize.query( "SELECT * FROM posts JOIN likes ON likes.postId = posts.postId" )
    const likelist = [];
    result.map((like) => { // 필터 함수가 어울린다 한번 참고해볼것
        if(like.userId === userId){
            likelist.push({
                "postId":like.postId,
                "title":like.title,
                "nickname":like.nickname,
                "updatedAt":like.updatedAt,
                "likes":like.likes
            });      
        }  
    })
    likelist.sort((a, b) => {return b.likes - a.likes});
    res.json({likelist});             
});

// 게시글 상세 조회 API 
router.get('/:postId', async (req, res) => { 
    const { postId } = req.params 
    
    const post = await posts.findOne({ where: { postId} }); 

    res.json({post:post});
});


// 상세 게시글 좋아요 누르기 
router.patch('/:postId/like', authMiddleware, async (req, res) => { 

    const { postId } = req.params;
    const { userId } = res.locals.user;

    const likepost = await likes.findOne({where: { postId,userId }})

    if (!likepost) {    
        await likes.create({postId, userId});
        await posts.increment({likes : 1},{where: { postId}});           
        res.json({bool:true, like : "좋아요를 등록 하였습니다"});
    } else {
        await likes.destroy({where: { postId,userId }});
        await posts.decrement({likes : 1},{where: { postId}});  
        res.json({bool:false, like : "좋아요를 취소 하였습니다"});  
    }      
});

// 게시글 작성 API
router.post("/", authMiddleware ,async (req, res) => { 
	const { title, content } = req.body; 
    const { nickname } = res.locals.user;

    const createdPost = await posts.create({ title, nickname, content });

    res.json({ post : createdPost , msg:"게시글 작성이 완료되었습니다." }); 
});

// 게시글 수정 API
router.patch('/:postId',authMiddleware, async (req,res) => {

    const { postId } = req.params; 
    const {content , title } = req.body;
    const { nickname } = res.locals.user; 

    const patchpost = await posts.findOne({where: { postId,nickname }});

    if(patchpost) {     
        await posts.update({ content, title } , {  where: { postId, nickname }  }); 
        res.json({ post : patchpost, msg:"게시글 수정이 완료 되었습니다."});
    } else {
        res.json({errormsg:"권한이 없습니다"});
    }
});

// 게시글 삭제 API
router.delete('/:postId',authMiddleware, async (req,res) => { 
    const { postId } = req.params; // 위와 동일
    const { nickname } = res.locals.user; 

   try {
        await posts.destroy({where: { postId,nickname }});
        res.json({ msg : "게시글 삭제가 완료 되었습니다."}); 
    } catch(err) {
        res.json({ errormsg : "권한이 없습니다"}); 
    } 
});

module.exports = router;