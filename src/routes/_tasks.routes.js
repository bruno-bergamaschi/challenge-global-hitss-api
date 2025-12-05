import { Router } from 'express';

import { tasksPersistController } from '../controllers/tasks/persist.controller.js';
import { tasksRetrieveController } from '../controllers/tasks/retrieve.controller.js';

import { middleware } from '../middleware/index.js';
import { taskSchema } from '../schemas/task.schema.js';

const router = Router();

router.get(
  '/tasks',
  middleware.createQueryOptions,
  tasksRetrieveController.getAll,
);

router.get('/tasks/:id', tasksRetrieveController.getById);

router.post(
  '/tasks',
  middleware.validateSchema(taskSchema.register),
  tasksPersistController.register,
);

router.patch(
  '/tasks/:id',
  middleware.validateSchema(taskSchema.edit),
  tasksPersistController.edit,
);

router.delete('/tasks/:id', tasksPersistController.deleteById);

export default router;
