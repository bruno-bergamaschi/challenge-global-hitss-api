import { databaseHelper } from '../helpers/database.js';

const register = async ({ dbClient, entity }) => {
  const { title, description, status } = entity;
  const values = [title, description, status];

  const query = `
    INSERT INTO task (
      title,
      description,
      status
    ) VALUES (
      $1,
      $2,
      $3
     ) RETURNING
      id,
      title,
      description,
      status;
  `;

  return dbClient.query(query, values).then(({ rows }) => {
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

  return dbClient.query(query, values).then(({ rows }) => {
    const [entity] = rows;
    return databaseHelper.toCamelCase(entity);
  });
};

const deleteById = async ({ dbClient, id }) => {
  return databaseHelper.softDelete({
    dbClient,
    id,
    tableName: 'task',
  });
};

export const getAll = async ({ dbClient, queryOptions, teamId }) => {
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
      t.status,
      json_agg(
        jsonb_build_object(
          'id', te.id,
          'name', te.name,
          'color', te.color
        )
      ) as teams,
      COUNT(*) over() AS total_count
    FROM
      task t
    LEFT JOIN team_task tt
      ON
      tt.task_id = t.id
      AND NOT tt.is_deleted
    LEFT JOIN team te
      ON
      te.id = tt.team_id
      AND NOT te.is_deleted
    WHERE
      NOT t.is_deleted
    ${searchParams}
    GROUP BY
      t.id,
      t.description,
      t.status
    ${databaseHelper.buildOrderBy(order, 'title ASC', [
      'title',
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
      t.status,
      json_agg(
        jsonb_build_object(
          'id', te.id,
          'name', te.name,
          'color', te.color
        )
      ) as teams
    FROM
      task t
    LEFT JOIN team_task tt
      ON
      tt.task_id = t.id
      AND NOT tt.is_deleted
    LEFT JOIN team te
      ON
      te.id = tt.team_id
      AND NOT te.is_deleted
    WHERE
      NOT t.is_deleted
      AND t.id = $1
    GROUP BY
      t.id,
      t.description,
      t.status
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
