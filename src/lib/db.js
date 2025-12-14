import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'fiscal_tracker_db',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export { pool };
export default pool;
