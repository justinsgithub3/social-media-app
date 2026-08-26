import { pool } from '../database/pool.js';


export const getUserData = async (username) => { 
    const [rows] = await pool.query("SELECT password_hash, username, id FROM users WHERE username = ?", [username]);
    return rows;
};

export const getUID = async (username) => {
    const result = await pool.query("SELECT id FROM users WHERE username = ?", [username]);
}
