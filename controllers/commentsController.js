import { getAllComments, createComment, deleteComment } from "../database/commentsQueries.js";

export const getComments = async (req, res) => {
    try {
        const { imageId } = req.params;
        const comments = await getAllComments(imageId);
        res.json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to retrieve comments' });
    }
};

export const removeComment = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteComment(id);
        return res.status(200).json({ message: 'Deleted successfully', result });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to retrieve comments' });
    }
};


export const addComment = async (req, res) => {
    try {
        const { imageId } = req.params;
        const { comment } = req.body;
        //test
        const userId = req.session?.userId;

        if (!comment || !comment.trim()) {
            return res.status(400).json({ error: 'Comment text is required' });
        }

        if (!imageId || isNaN(Number(imageId))) {
            return res.status(400).json({ error: 'Invalid image ID' });
        }

        if (!userId) {
            return res.status(401).json({ error: 'User ID is required' });
        }
        

        // actually adding comment to database
        const commentId = await createComment(imageId, userId, comment);

        res.status(201).json({
            message: 'Comment added successfully',
            commentId,
            imageId: Number(imageId),
            userId,
            comment: comment.trim(),
            username: req.session.username || 'You'
        })
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }

}