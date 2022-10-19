const Joi = require('joi');

require('dotenv').config(); // 닷 env

//  유효성 검사
const schema = Joi.object().keys({
    nickname: Joi.string().min(3).max(30),
    password: Joi.string().min(4).max(20),
    confirmPassword: Joi.ref('password'),
});

const UserService = require('../services/users.services');

class UsersController {
    UserService = new UserService();
    // 회원 가입 API
    signUpUser = async (req, res, next) => {
        try {
            if (req.headers.authorization) {
                res.status(400).json({ error: '이미 로그인이 되어있습니다.' });
                return;
            } else {
                const { nickname, password } = await schema.validateAsync(
                    req.body
                );

                if (password.indexOf(nickname) !== -1) {
                    res.status(400).json({
                        error: '비밀번호에는 닉네임과 동일한 문자를 포함할수없습니다',
                    });
                    return;
                } else {
                    const signUpUser = await this.UserService.signUpUser(
                        nickname,
                        password
                    );
                    res.status(201).send({ data: signUpUser });
                }
            }
        } catch (err) {
            next(err);
        }
    };

    // 토큰 발급 및 로그인 API
    loginUser = async (req, res, next) => {
        try {
            // 검사시작
            if (req.headers.authorization) {
                res.status(400).json({ error: '이미 로그인이 되어있습니다.' });
                return;
            } else {
                const { nickname, password } = await schema.validateAsync(
                    req.body
                );

                const LoginUser = await this.UserService.loginUser(
                    nickname,
                    password
                );
                res.status(201).send({ token: LoginUser });
            }
        } catch (err) {
            next(err);
        }
    };
}

module.exports = UsersController;
