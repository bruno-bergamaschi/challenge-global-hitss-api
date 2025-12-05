import { writePool } from '../../src/database/connection.js';
import { databaseHelper } from '../../src/helpers/database.js';

export async function truncateAllTables() {
  const client = await writePool.connect();

  try {
    const { rows } = await client.query(`
      select tablename
      from pg_tables
      where schemaname = 'public'
        and tablename not in ('knex_migrations', 'knex_migrations_lock')
    `);

    if (!rows.length) return;

    const tableNames = rows.map((r) => `"public"."${r.tablename}"`).join(', ');

    await client.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE`);
  } finally {
    client.release();
  }
}

export async function registerRecord(tableName, entity) {
  const dbClient = await writePool.connect();

  const key = Object.keys(entity);
  const values = Object.values(entity).map((value) => `'${value}'`);

  try {
    const query = `
      INSERT INTO ${tableName} (
        ${key}
      )
      VALUES (
        ${values}
      ) RETURNING
       id,
        ${key};
    `;

    return await dbClient.query(query).then(({ rows }) => {
      const [entity] = rows;
      return databaseHelper.toCamelCase(entity);
    });
  } finally {
    dbClient.release();
  }
}

export async function deleteRecordById(tableName, id) {
  const dbClient = await writePool.connect();

  try {
    const query = `
      UPDATE ${tableName}
      SET is_deleted = true
      WHERE id = ${id}
    `;

    return await dbClient.query(query);
  } finally {
    dbClient.release();
  }
}

export async function getAllRecords({ tableName, columns, customQuery }) {
  const dbClient = await writePool.connect();

  try {
    const query = `
      SELECT
        ${columns}
      FROM
        ${tableName}
      ${customQuery}
    `;

    return dbClient.query(query).then(({ rows }) => {
      return databaseHelper.handleGetAll(rows);
    });
  } finally {
    dbClient.release();
  }
}
