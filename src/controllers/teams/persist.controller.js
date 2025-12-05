import { teamsUseCase } from '../../use-cases/teams.use-case.js';

const register = async (req, res) => {
  const registeredEntity = await teamsUseCase.register({
    dbConnection: req.dbConnection,
    body: req.body,
  });

  res.status(201).json(registeredEntity);
};

const edit = async (req, res) => {
  const editedEntity = await teamsUseCase.edit({
    dbConnection: req.dbConnection,
    body: req.body,
    id: req.params.id,
  });

  res.json(editedEntity);
};

const deleteById = async (req, res) => {
  await teamsUseCase.deleteById({
    dbConnection: req.dbConnection,
    id: req.params.id,
  });

  res.status(204).send();
};

export const teamsPersistController = {
  register,
  edit,
  deleteById,
};
