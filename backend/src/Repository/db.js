import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

// Ensure this file is executed in a Node.js environment
const env = process.env;

const dbConfig = {
  host: env.DB_HOST || 'localhost',
  user: env.DB_USER || 'root',
  password: env.DB_PASSWORD || 'GuiiLherme0091',
  database: env.DB_NAME || 'MindUP',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

export default pool;
