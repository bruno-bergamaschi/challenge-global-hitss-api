import { z } from 'zod';
import { taskStatusEnum } from '../enums/task-status.enum.js';

const string = 'deve ser uma string';

const register = z.object({
  title: z
    .string(string)
    .min(1, 'deve ter pelo menos 1 caractere')
    .max(150, 'deve ter no máximo 150 caracteres'),
  description: z.string(string),
  teamIds: z
    .array(z.int('deve ser um número'), 'deve ser uma lista')
    .optional(),
  status: z.enum(taskStatusEnum, {
    error: `deve ser ${Object.values(taskStatusEnum).join(', ')}`,
  }),
});

const edit = register
  .pick({
    title: true,
    description: true,
    status: true,
  })
  .partial();

export const taskSchema = {
  register,
  edit,
};
