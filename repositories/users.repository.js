const { Users } = require('../models'); // mysql  유저 스키마 모듈
const db = require('../models');

class UserRepository {
    findUser = async (nickname) => {
        return await Users.findOne({ where: { nickname } });
    };

    signUpUser = async (nickname, hashedPw, salt) => {
        const t = await db.sequelize.transaction();
        try {
            const createUser = await Users.create(
                {
                    nickname,
                    hashedPw,
                    salt,
                },
                { transaction: t }
            );
            await t.commit();
            return createUser;
        } catch (err) {
            await t.rollback();
            throw new Error(err)

        }
    };

    loginUser = async (nickname) => {
        return await Users.findOne({ where: { nickname } });
    };
}

module.exports = UserRepository;
