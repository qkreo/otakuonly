const CommentService = require('../services/comments.services');

class CommentsController {
    commentService = new CommentService();

    createComment = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { nickname, userId } = res.locals.user;
            const { content } = req.body;

            const createComment = await this.commentService.createComment(
                postId,
                nickname,
                userId,
                content
            );

            res.status(200).json({ data: createComment });
        } catch (err) {
            next(err);
        }
    };

    updateComment = async (req, res, next) => {
        try {
            const { postId, commentId } = req.params;
            const { nickname } = res.locals.user;
            const { content } = req.body;

            const updateComment = await this.commentService.updateComment(
                postId,
                commentId,
                nickname,
                content
            );

            res.status(200).json({ data: updateComment });
        } catch (err) {
            next(err);
        }
    };

    deleteComment = async (req, res, next) => {
        try {
            const { commentId } = req.params;
            const { nickname } = res.locals.user;

            const deleteComment = await this.commentService.deleteComment(
                commentId,
                nickname
            );

            res.status(200).json({ data: deleteComment });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = CommentsController;
