
const express = require('express');
const router = express.Router();

const commentRouter = require("./comment"); // 코멘트 라우터 경로

const Post = require("../schemas/post"); // 포스트 스키마 경로

//"_id" : ObjectId("633866a7f81d9ea29ffe02d7"),
// 게시글 상세 조회 API 
router.get('/:_id', async (req, res) => { // 현재 url은 localhost:5000/index/posts/:_id 상태임
    const { _id } = req.params // 파라미터값을 요청하면 {_id:"633866a7f81d9ea29ffe02d7"} 이렇게 나옴 _id를 키로 이용하여 구조분해 할당
    
    const posts = await Post.find({"_id" : _id}); // Post db 에서 find 조건은 db내의 "_id"값과 구조분해 할당한 _id 값이 동일한 것으로 

    const post = posts.map((post) => { // 맵 함수로 필요한 값들만 가져온다
        title = post.title,
        user = post.user,
        content = post.content,
        date = post.created
        return {"title":title , "user":user , "content":content , "date":date };   
        });
        res.json({post: post});
});


// 게시글 작성 API
router.post("/", async (req, res) => { //post 메소드 
	const {title, user, password, content } = req.body; // 바디값으로 작성된 property들을 가져온다 그값을 구조 분해 할당

  const createdPost = await Post.create({ title, user, password, content });//Post.create로 db에 값을 저장함과 동시에 createdPost 라는 변수에 넣는다

  res.json({ post : createdPost , msg:"게시글 작성이 완료되었습니다." }); 

});
// 게시글 수정 API
//"_id" : ObjectId("633866a7f81d9ea29ffe02d7"),"password" : "12313",

router.patch('/:_id', async (req,res) => { //patch 메소드 

    const { _id } = req.params; // 현재 들어가있는 게시글의 파라미터 값을 가져온다 그 뒤 구조 분해 현재 localhost:5000/index/posts/:_id ( {_id="633866a7f81d9ea29ffe02d7"} ) 상태임
     //req.params = {_id="633866a7f81d9ea29ffe02d7"}    
    const { password , content , user , title } = req.body;  // 바디에서 작성된 값을 가져온뒤 구조 분해
    const posts = await Post.find({"_id" : _id}); // Post DB에서 해당 데이터를 가져옴
    
    if(String(password) === posts[0].password){ // String(password) "패스워드는 req.body 에서 가져온 값" 과  posts[0].password (posts[0]인이유는 가져올때 array로 가져와서..) 를비교
        await Post.updateOne({"_id" : _id},{ $set:{ content, title, user } }); //true 일경우 게시글을 가져온 값으로  수정

        res.json({ post : posts, msg:"게시글 수정이 완료 되었습니다."});
    } else {  // 위에서 가져온 비밀번호를 대조했을때 다를 경우
        res.status(400).json({ errorMessage: "비밀번호가 다릅니다" });  // 에러스테이터스와 메세지를 res함      
    };
    
    
});

// 게시글 삭제 API
router.delete('/:_id', async (req,res) => { // delete 메소드 
    const { _id } = req.params; // 위와 동일
    const { password } = req.body;    // 위와 동일
    const posts = await Post.find({"_id" : _id}); // 위와 동일
    
    if(String(password) === posts[0].password){ // 비밀번호 비교
        await Post.deleteOne({"_id" : _id}); //true 일시 데이터 삭제
        res.json({ msg : "게시글 삭제가 완료 되었습니다."}); 
    } else {      
        res.status(400).json({ errorMessage: "비밀번호가 다릅니다" }); //false 일시 에러메세지 출력  
    };
    
});

router.use('/:_id/comments', [commentRouter]); //코멘트 라우터 사용

module.exports = router;