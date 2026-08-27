import { getAllComments } from "../database/commentsQueries.js";

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