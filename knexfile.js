import env from './src/helpers/env.js';

export default {
  client: 'pg',
  connection: {
    host: env.DB_HOST,
    port: Number(env.DB_PORT ?? 5432),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/database/migrations',
    extension: 'js',
  },
  seeds: {
    directory: './src/database/seeds',
  },
};
