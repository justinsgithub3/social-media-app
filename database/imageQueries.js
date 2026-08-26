import { pool } from '../database/pool.js';

export const putImage = async (userId, imageKey) => {
    const result = await pool.query("INSERT INTO images (user_id, s3_key) VALUES (?, ?)", [userId, imageKey]);
    return result;
}

export const getImageData = async () => {
    const [rows] = await pool.query(`
        SELECT  images.id, 
                images.s3_key, 
                images.created_at,
                users.username
        FROM images
        JOIN users ON images.user_id = users.id
        ORDER BY images.created_at DESC
    `);
    return rows;
}

export const getImageDataByUserId = async (userId) => {
  const [rows] = await pool.query(`
    SELECT 
      images.id, 
      images.s3_key, 
      images.created_at,
      users.username
    FROM images
    JOIN users ON images.user_id = users.id
    WHERE images.user_id = ?
    ORDER BY images.created_at DESC
  `, [userId]);

  return rows;
}