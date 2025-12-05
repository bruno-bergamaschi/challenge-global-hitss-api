import { databaseHelper } from '../helpers/database.js';

const register = async ({ dbClient, entity }) => {
  const { name, color } = entity;
  const values = [name, color];

  const query = `
    INSERT INTO team (
      name,
      color
    ) VALUES (
      $1,
      $2
     ) RETURNING
      id,
      name,
      color;
  `;

  return dbClient.query(query, values).then(({ rows }) => {
    const [entity] = rows;
    return databaseHelper.toCamelCase(entity);
  });
};

const edit = async ({ dbClient, id, entity }) => {
  const { name, color } = entity;
  const values = [name, color, id];

  const query = `
    UPDATE team
    SET
      name = $1,
      color = $2,
      updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
    WHERE
      id = $3
    RETURNING
      id,
      name,
      color;
  `;

  return dbClient.query(query, values).then(({ rows }) => {
    const [entity] = rows;
    return databaseHelper.toCamelCase(entity);
  });
};

const deleteById = async ({ dbClient, id }) => {
  return databaseHelper.softDelete({
    dbClient,
    id,
    tableName: 'team',
  });
};

const getAll = async ({ dbClient, queryOptions }) => {
  const { limit, offset, search, order } = queryOptions;
  const values = [limit, offset];

  let searchParams = '';

  if (search) {
    const index = values.push(`%${search}%`);

    searchParams += ` AND t.name ILIKE $${index}`;
  }

  const query = `
    SELECT
      t.id,
      t.name,
      t.color,
      COUNT(*) OVER() AS total_count
    FROM
      team t
    WHERE
      NOT t.is_deleted
    ${searchParams}
    ${databaseHelper.buildOrderBy(order, 'name ASC', ['name', 'color'])}
    LIMIT $1 OFFSET $2;
  `;

  return dbClient.query(query, values).then(({ rows }) => {
    return databaseHelper.handleGetAll(rows);
  });
};

const getById = async ({ dbClient, id }) => {
  const values = [id];

  const query = `
    SELECT
      t.id,
      t.name,
      t.color
    FROM
      team t
    WHERE
      t.id = $1
  `;

  return dbClient.query(query, values).then(({ rows }) => {
    const [entity] = rows.map((item) => databaseHelper.toCamelCase(item));
    return entity;
  });
};

export const teamsService = {
  register,
  edit,
  deleteById,
  getAll,
  getById,
};
