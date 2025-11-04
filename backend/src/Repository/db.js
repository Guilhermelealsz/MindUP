import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const env = process.env;

const dbConfig = {
  host: env.DB_HOST || 'localhost',
  user: env.DB_USER || 'root',
  password: env.DB_PASSWORD || '1234',
  database: env.DB_NAME || 'MindUP',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

export default pool;
