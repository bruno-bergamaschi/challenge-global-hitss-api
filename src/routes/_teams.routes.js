import { Router } from 'express';

import { teamsPersistController } from '../controllers/teams/persist.controller.js';
import { teamsRetrieveController } from '../controllers/teams/retrieve.controller.js';

import { middleware } from '../middleware/index.js';
import { teamSchema } from '../schemas/team.schema.js';

const router = Router();

router.get(
  '/teams',
  middleware.createQueryOptions,
  teamsRetrieveController.getAll,
);

router.get('/teams/:id', teamsRetrieveController.getById);

router.post(
  '/teams',
  middleware.validateSchema(teamSchema.register),
  teamsPersistController.register,
);

router.patch(
  '/teams/:id',
  middleware.validateSchema(teamSchema.edit),
  teamsPersistController.edit,
);

router.delete('/teams/:id', teamsPersistController.deleteById);

export default router;
