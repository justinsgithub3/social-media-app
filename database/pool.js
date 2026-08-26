import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  uri: process.env.JAWSDB_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});