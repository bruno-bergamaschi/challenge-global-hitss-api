import CustomError from '../../helpers/customError.js';
import { teamsUseCase } from '../../use-cases/teams.use-case.js';

const getById = async (req, res, next) => {
  try {
    const result = await teamsUseCase.getById({
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
  const { rows, totalCount } = await teamsUseCase.getAll({
    dbConnection: req.dbConnection,
    queryOptions: req.queryOptions,
  });

  return res.json({
    results: rows,
    totalCount,
  });
};

export const teamsRetrieveController = {
  getById,
  getAll,
};
