const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController();

// 회원 가입 API  
router.post("/signUp", usersController.signUpUser)

// 토큰 발급 및 로그인 API 
router.post("/login", usersController.loginUser)
 
module.exports = router;