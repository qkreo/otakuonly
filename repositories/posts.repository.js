// repositories/posts.repository.js
const db = require('../models');
const { where } = require('sequelize');
const { Posts, Likes, Comments } = require('../models');


class PostRepository {
    findAllPost = async () => {
        return await Posts.findAll({
            order: [['createdAt', 'desc']],
            attributes: { exclude: ['content'] },
        });
    };

    findPostById = async (postId) => {
        return await Posts.findByPk(postId, { include: Comments });
    };

    createPost = async (nickname, userId, title, content) => {
        return await Posts.create({
            nickname,
            userId,
            title,
            content,
            likes: 0,
        });
    };

    updatePost = async (postId, nickname, title, content) => {
        return await Posts.update(
            { title, content },
            { where: { postId, nickname } }
        );
    };

    deletePost = async (postId, nickname) => {
        return await Posts.destroy({
            where: { postId, nickname },
        });
    };

    myLikePosts = async (userId) => {
        return await Likes.findAll({
            where: { userId },
            attributes: ['postId'],
            include: {
                model: Posts,
                order: [['likes', 'desc']],
                attributes: ['title', 'nickname', 'likes', 'createdAt'],
            }, // 인클루드 시에는 벨류값으로 모델명 직접입력 인클루드한 posts를 좋아요 갯수로 내림차순
        });
    };

    findLike = async (postId, userId) => {
        return await Likes.findOne({ where: { postId, userId } });
    };

    upLike = async (postId, userId) => {
        const t = await db.sequelize.transaction();
        try {
            await Likes.create({ postId, userId })
            const likepost = await Posts.increment(
                { likes: 1 },
                { where: { postId } },
                { transaction: t }
            );
            await t.commit();
            return likepost;
        } catch (err) {
            await t.rollback();
            throw new Error(err.message);
        }
    };

    downLike = async (postId, userId) => {
        const t = await db.sequelize.transaction();
        try {
            await Likes.destroy({where:{ postId, userId }}, { transaction: t });
            const likepost = await Posts.decrement(
                { likes: 1 },
                { where: { postId } },
                { transaction: t }
            );
            await t.commit();
            return likepost;
        } catch (err) {
            await t.rollback();
            throw new Error(err.message);
        }
    };

}

module.exports = PostRepository;
