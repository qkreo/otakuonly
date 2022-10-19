const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // 토큰 모듈

require('dotenv').config(); // 닷 env

const UserRepository = require('../repositories/users.repository');

class UserService {
    UserRepository = new UserRepository();
    
    signUpUser = async (nickname, password) => {
        
        const findUser = await this.UserRepository.findUser(nickname)    

        if(!findUser) {
            const salt = crypto.randomBytes(32).toString('base64');
        const hashedPw = crypto
            .pbkdf2Sync(password, salt, 50, 32, 'sha512')
            .toString('base64');

        const signUpUser = await this.UserRepository.signUpUser(
            nickname,
            hashedPw,
            salt
        );
        return signUpUser;
        } else {
            throw new Error("해당 닉네임은 사용할 수 없습니다");
        }
        
    };

    loginUser = async (nickname, password) => {
        const loginUser = await this.UserRepository.loginUser(nickname);
        if (!loginUser) {
            throw new Error('닉네임 또는 비밀번호가 다릅니다');
        } else {
            const hashedPw = crypto
                .pbkdf2Sync(password, loginUser.salt, 50, 32, 'sha512')
                .toString('base64');

            if (loginUser.hashedPw !== hashedPw) {
                throw new Error('닉네임 또는 비밀번호가 다릅니다');
            }
            const token = jwt.sign(
                { userId: loginUser.userId },
                process.env.secretKey,
                { expiresIn: '12h' }
            );
            return token;
        }
    };
}

module.exports = UserService;
