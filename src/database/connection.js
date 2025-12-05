import pkg from 'pg';
import env from '../helpers/env.js';

const { Pool } = pkg;

const baseConfig = {
  port: Number(env.DB_PORT ?? 5432),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  max: 10,
  idleTimeoutMillis: 30000,
};

export const writePool = new Pool({
  ...baseConfig,
  host: env.DB_WRITE_HOST ?? env.DB_HOST,
});

export const readPool = new Pool({
  ...baseConfig,
  host: env.DB_READ_HOST ?? env.DB_HOST,
});

export const pools = { write: writePool, read: readPool };

export const queryWrite = (text, params) => writePool.query(text, params);
export const queryRead = (text, params) => readPool.query(text, params);

export const closeConnections = async () => {
  await Promise.all([writePool.end(), readPool.end()]);
};
