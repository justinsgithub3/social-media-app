import { pool } from '../database/pool.js';

// placeholder for real query
export const putComment = async (userId, imageKey) => {
    const result = await pool.query("INSERT INTO images (user_id, s3_key) VALUES (?, ?)", [userId, imageKey]);
    return result;
}

export const getAllComments = async (imageId) => {
    const [rows] = await pool.query(`
            SELECT  comments.id, 
                    comments.image_id, 
                    comments.user_id, 
                    comments.comment, 
                    comments.created_at, 
                    users.username 
            FROM comments 
            JOIN users ON comments.user_id = users.id
            ORDER BY comments.created_at ASC
    `, [imageId]);
    return rows;
}

export const createComment = async (imageId, userId, comment) => {
    const [result] = await pool.query(
        `INSERT INTO comments (image_id, user_id, comment) VALUES (?, ?, ?)`,
        [imageId, userId, comment]
    );
    return result.insertId;
};