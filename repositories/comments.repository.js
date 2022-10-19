const { Comments } = require('../models');
const db = require('../models');

class CommentRepository {
    createComment = async (postId, nickname, userId, content) => {
        return await Comments.create({
            postId,
            nickname,
            userId,
            content,
        });
    };

    updateComment = async (postId, commentId, nickname, content) => {
        const t = await db.sequelize.transaction();
        try {
            const updateComment = await Comments.update(
                { content },
                { where: { postId, commentId, nickname } },
                { transaction: t }
            );
            await t.commit();
            return updateComment;
        } catch (err) {
            await t.rollback();
            throw new Error(err.message);
        }
    };

    deleteComment = async (commentId, nickname) => {
        return await Comments.destroy({
            where: { commentId, nickname },
        });
    };
}

module.exports = CommentRepository;
