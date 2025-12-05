import { teamsService } from '../services/teams.service.js';
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

const register = async ({ dbConnection, body }) => {
  const dbClient = await dbConnection.write.connect();

  try {
    await dbClient.query('BEGIN');

    const registeredEntity = await teamsService.register({
      dbClient,
      entity: body,
    });

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
  const { name, color, isActive } = body;

  const dbClient = await dbConnection.write.connect();

  try {
    const team = await executeService({
      service: teamsService.getById({
        dbClient,
        id,
      }),
      entity: 'Time',
      id,
    });

    if (
      !shouldUpdateValue(team.name, name) &&
      !shouldUpdateValue(team.color, color)
    ) {
      return team;
    }

    const entity = {
      id: team.id,
      name: checkValidValue(team.name, name),
      color: checkValidValue(team.color, color),
    };

    await dbClient.query('BEGIN');

    const editedEntity = await teamsService.edit({
      dbClient,
      id: team.id,
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
    const team = await executeService({
      service: teamsService.getById({
        dbClient,
        id,
      }),
      entity: 'Time',
      id,
    });

    await dbClient.query('BEGIN');

    const deletedEntity = await teamsService.deleteById({
      dbClient,
      id: team.id,
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

const getAll = async ({ dbConnection, queryOptions }) => {
  const dbClient = await dbConnection.read.connect();

  try {
    const results = await teamsService.getAll({
      dbClient,
      queryOptions: queryOptions,
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
    const result = await teamsService.getById({
      dbClient,
      id,
    });

    return result;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }

    _internalServerError();
  } finally {
    dbClient.release();
  }
};

export const teamsUseCase = {
  register,
  edit,
  deleteById,
  getAll,
  getById,
};
