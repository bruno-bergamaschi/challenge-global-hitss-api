import CustomError from '../../helpers/customError.js';
import { tasksUseCase } from '../../use-cases/tasks.use-case.js';

const getById = async (req, res, next) => {
  try {
    const result = await tasksUseCase.getById({
      dbConnection: req.dbConnection,
      id: req.params.id,
    });

    if (!result) {
      throw new CustomError(
        `Time com ID '${req.params.id}' não encontrado.`,
        404,
        '404-entity-not-found',
      );
    }

    return res.json(result);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res) => {
  const { rows, totalCount } = await tasksUseCase.getAll({
    dbConnection: req.dbConnection,
    queryOptions: req.queryOptions,
    teamId: req.query.teamId,
  });

  return res.json({
    results: rows,
    totalCount,
  });
};

export const tasksRetrieveController = {
  getById,
  getAll,
};
