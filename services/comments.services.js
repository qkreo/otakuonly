const CommentRepository = require('../repositories/comments.repository');

class CommentService {
    commentRepository = new CommentRepository();

    createComment = async (postId, nickname,userId, content) => {
   
        const createComment = await this.commentRepository.createComment(
            postId,
            nickname,
            userId,
            content
        );
        if (createComment) {
            return createComment;
        } else {
            throw new Error("저장 중 오류가 발생했습니다.");
        }
        
    };
    updateComment = async (postId, commentId, nickname, content) => {
        const [updateComment] = await this.commentRepository.updateComment(
            postId,
            commentId,
            nickname,
            content
        );
        if(updateComment) {
            return "댓글 수정이 완료";
        } else {
            throw new Error("댓글 수정 권한이 없으시군요 댓글이없거나");
        }
        
    };

    deleteComment = async (commentId, nickname) => {
        const deleteComment = await this.commentRepository.deleteComment(
            commentId,
            nickname
        );
        if(deleteComment) {
            return "댓글 파괴 완료;;";
        } else {
            throw new Error("댓글 수정 권한이 없으시군요 댓글이없거나");
        }
        
    };
}
module.exports = CommentService;
