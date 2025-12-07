import { teamsService } from '../services/teams.service.js';
import { tasksService } from '../services/tasks.service.js';
import { teamTasksService } from '../services/team_tasks.service.js';
import CustomError from '../helpers/customError.js';
import {
  checkValidValue,
  executeService,
  shouldUpdateValue,
} from '../helpers/utility.helper.js';

const _internalServerError = () => {
  throw new CustomError(
    'Erro interno do servidor.',
    500,
    '500-internal-server-error',
  );
};

const _getEntities = async ({ dbClient, teamIds, taskId }) => {
  const entities = {
    teamIds: null,
    task: null,
  };

  if (teamIds && teamIds.length) {
    const ids = [];

    await Promise.all(
      teamIds.map(async (id) => {
        const team = await executeService({
          service: teamsService.getById({
            dbClient,
            id,
          }),
          entity: 'Time',
          id,
        });

        ids.push(team.id);
      }),
    );

    entities.teamIds = ids;
  }

  if (taskId) {
    entities.task = await executeService({
      service: tasksService.getById({
        dbClient,
        id: taskId,
      }),
      entity: 'Tarefa',
      id: taskId,
      isFemaleEntity: true,
    });
  }

  return entities;
};

const register = async ({ dbConnection, body }) => {
  const dbClient = await dbConnection.write.connect();

  try {
    const { teamIds } = await _getEntities({
      dbClient,
      teamIds: body.teamIds,
    });

    await dbClient.query('BEGIN');

    const registeredEntity = await tasksService.register({
      dbClient,
      entity: body,
    });

    if (teamIds) {
      await Promise.all(
        teamIds.map((id) => {
          teamTasksService.register({
            dbClient,
            entity: {
              teamId: id,
              taskId: registeredEntity.id,
            },
          });
        }),
      );
    }

    await dbClient.query('COMMIT');

    return registeredEntity;
  } catch (err) {
    await dbClient.query('ROLLBACK');

    if (err instanceof CustomError) {
      throw err;
    }

    _internalServerError();
  } finally {
    dbClient.release();
  }
};

const edit = async ({ dbConnection, body, id }) => {
  const { title, description, status } = body;

  const dbClient = await dbConnection.write.connect();

  try {
    const { task } = await _getEntities({
      dbClient,
      taskId: id,
    });

    if (
      !shouldUpdateValue(task.title, title) &&
      !shouldUpdateValue(task.description, description) &&
      !shouldUpdateValue(task.status, status)
    ) {
      return task;
    }

    const entity = {
      id: task.id,
      title: checkValidValue(task.title, title),
      description: checkValidValue(task.description, description),
      status: checkValidValue(task.status, status),
    };

    await dbClient.query('BEGIN');

    const editedEntity = await tasksService.edit({
      dbClient,
      id: task.id,
      entity,
    });

    await dbClient.query('COMMIT');

    return editedEntity;
  } catch (err) {
    await dbClient.query('ROLLBACK');

    if (err instanceof CustomError) {
      throw err;
    }

    _internalServerError();
  } finally {
    dbClient.release();
  }
};

const deleteById = async ({ dbConnection, id }) => {
  const dbClient = await dbConnection.write.connect();

  try {
    const { task } = await _getEntities({
      dbClient,
      taskId: id,
    });

    await dbClient.query('BEGIN');

    await teamTasksService.deleteById({
      dbClient,
      id: task.id,
    });

    const deletedEntity = await tasksService.deleteById({
      dbClient,
      id: task.id,
    });

    await dbClient.query('COMMIT');

    return deletedEntity;
  } catch (err) {
    await dbClient.query('ROLLBACK');

    if (err instanceof CustomError) {
      throw err;
    }

    _internalServerError();
  } finally {
    dbClient.release();
  }
};

const getAll = async ({ dbConnection, queryOptions, teamId }) => {
  const dbClient = await dbConnection.read.connect();

  try {
    const results = await tasksService.getAll({
      dbClient,
      queryOptions: queryOptions,
      teamId,
    });

    return results;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }

    _internalServerError();
  } finally {
    dbClient.release();
  }
};

const getById = async ({ dbConnection, id }) => {
  const dbClient = await dbConnection.read.connect();

  try {
    const { task } = await _getEntities({
      dbClient,
      taskId: id,
    });

    return task;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }

    _internalServerError();
  } finally {
    dbClient.release();
  }
};

export const tasksUseCase = {
  register,
  edit,
  deleteById,
  getAll,
  getById,
};
