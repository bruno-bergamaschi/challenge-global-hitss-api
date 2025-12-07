import { databaseHelper } from '../helpers/database.js';

const register = async ({ dbClient, entity }) => {
  const { teamId, taskId } = entity;
  const values = [teamId, taskId];

  const query = `
    INSERT INTO team_task (
      team_id,
      task_id
    ) VALUES (
      $1,
      $2
     ) RETURNING
      id,
      team_id,
      task_id;
  `;

  return dbClient.query(query, values).then(({ rows }) => {
    const [entity] = rows;
    return databaseHelper.toCamelCase(entity);
  });
};

const deleteById = async ({ dbClient, id, primaryColumn = 'task_id' }) => {
  return databaseHelper.softDelete({
    dbClient,
    id,
    tableName: 'team_task',
    primaryColumn,
  });
};

export const teamTasksService = {
  register,
  deleteById,
};
