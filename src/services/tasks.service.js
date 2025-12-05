import { databaseHelper } from '../helpers/database.js';

const register = async ({ dbClient, entity }) => {
  const { title, description, status, teamId } = entity;
  const values = [title, description, status, teamId];

  const query = `
    INSERT INTO task (
      title,
      description,
      status,
      team_id
    ) VALUES (
      $1,
      $2,
      $3,
      $4
     ) RETURNING
      id,
      title,
      description,
      team_id,
      status;
  `;

  return await dbClient.query(query, values).then(({ rows }) => {
    const [entity] = rows;
    return databaseHelper.toCamelCase(entity);
  });
};

const edit = async ({ dbClient, id, entity }) => {
  const { title, description, status } = entity;
  const values = [title, description, status, id];

  const query = `
    UPDATE task
    SET
      title = $1,
      description = $2,
      status = $3,
      updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
    WHERE
      id = $4
    RETURNING
      id,
      title,
      description,
      status;
  `;

  return await dbClient.query(query, values).then(({ rows }) => {
    const [entity] = rows;
    return databaseHelper.toCamelCase(entity);
  });
};

const deleteById = async ({ dbClient, id }) => {
  return await databaseHelper.softDelete({
    dbClient,
    id,
    tableName: 'task',
  });
};

const getAll = async ({ dbClient, queryOptions, teamId }) => {
  const { limit, offset, filter, order } = queryOptions;
  const values = [limit, offset];
  let searchParams = '';

  if (filter) {
    const index = values.push(`%${filter}%`);

    searchParams += ` AND (t.title ILIKE $${index})`;
  }

  if (teamId) {
    const index = values.push(teamId);
    searchParams += ` AND te.id = $${index}`;
  }

  const query = `
    SELECT
      t.id,
      t.title,
      t.description,
      t.team_id,
      t.status,
      COUNT(*) OVER() AS total_count
    FROM
      task t
    INNER JOIN team te
      ON te.id = t.team_id
      AND NOT te.is_deleted
    WHERE
      NOT t.is_deleted
    ${searchParams}
    ${databaseHelper.buildOrderBy(order, 'title ASC', [
      'description',
      'status',
    ])}
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
      t.title,
      t.description,
      t.team_id,
      t.status
    FROM
      task t
    WHERE
      t.id = $1
  `;

  return dbClient.query(query, values).then(({ rows }) => {
    const [entity] = rows.map((item) => databaseHelper.toCamelCase(item));
    return entity;
  });
};

export const tasksService = {
  register,
  edit,
  deleteById,
  getAll,
  getById,
};
