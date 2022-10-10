const express = require('express');
const router = express.Router();
const Joi = require('joi');
const crypto = require('crypto');
const jwt = require("jsonwebtoken"); // 토큰 모듈
const { Op } = require("sequelize"); // 시퀄라이즈 mysql 모듈
const { User } = require("../models"); // mysql  유저 스키마 모듈

const secretKey = "customized-secret-key"

//  유효성 검사
const schema = Joi.object().keys({ 
    nickname: Joi.string().min(3).max(30),
    password: Joi.string().min(4).max(20).disallow(Joi.ref('nickname')),
    confirmPassword:Joi.ref('password'),
    email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    })

router.get('/', (req, res) => {
    res.json({"msg":"접속을 환영합니다",
    "/post/:postId":"상세게시글 보기",
    "/post/:postId/comments":"전체 댓글보기",
    "/post/:postId/comments/comments_id":"상세게시글",
    "/post/:postId/like":"해당게시글에 좋아요 누르기 및 취소",
    "/post/like":"내가 좋아요한 게시글 보기 "});
  });

// 회원 가입 API  
router.post("/users", async (req, res) => {
    const info = req.body;
    const email = info.email;
    const nickname = info.nickname;

    try {
        await schema.validateAsync(info);

        const existUsers = await User.findAll({
            where: { [Op.or]: [{ nickname:nickname }, { email:email }] } });
        
            if (existUsers.length) {
            res.status(400).send({
                errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
            });
            return;
            } else {
            const salt = crypto.randomBytes(32).toString('base64');
            const hashedPw = crypto.pbkdf2Sync(info.password, salt, 50, 32, 'sha512').toString('base64')
            await User.create({ email, nickname, hashedPw ,salt});
            res.status(201).send({ message: "회원 가입에 성공하였습니다." });  
            }                   
    } catch (e) { // 유효성 검사 에러
        return res.status(400).json({ code: 400, message: e.message }) 
    }
});

// 토큰 발급 및 로그인 API 
router.post("/auth", async (req, res) => {
    const info = req.body;
      
    try { // 검사시작 
        await schema.validateAsync(info);
        const user = await User.findOne({ where: { email:info.email} });

        const hashedPw = crypto.pbkdf2Sync(info.password, user.salt, 50, 32, 'sha512').toString('base64')

        if (user.hashedPw !== hashedPw) {
            res.status(400).send({
            errorMessage: "이메일 또는 패스워드가 잘못됐습니다.",
            });
            return;
        } else {
            const token = jwt.sign({ userId: user.userId }, secretKey);
            res.send({token});      
        }
        
    } catch (e) { // 유효성 검사 에러 
        return res.status(400).json({ code: 400, message: e.message }) 
    }           
});

module.exports = router;