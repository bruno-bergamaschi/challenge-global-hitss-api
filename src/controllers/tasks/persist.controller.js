import { tasksUseCase } from '../../use-cases/tasks.use-case.js';

const register = async (req, res) => {
  const registeredEntity = await tasksUseCase.register({
    dbConnection: req.dbConnection,
    body: req.body,
  });

  res.status(201).json(registeredEntity);
};

const edit = async (req, res) => {
  const editedEntity = await tasksUseCase.edit({
    dbConnection: req.dbConnection,
    body: req.body,
    id: req.params.id,
  });

  res.json(editedEntity);
};

const deleteById = async (req, res) => {
  await tasksUseCase.deleteById({
    dbConnection: req.dbConnection,
    id: req.params.id,
  });

  res.status(204).send();
};

export const tasksPersistController = {
  register,
  edit,
  deleteById,
};
