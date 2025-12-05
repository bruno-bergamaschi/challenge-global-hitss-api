import { z } from 'zod';
import { taskStatusEnum } from '../enums/task-status.enum.js';

const string = 'deve ser uma string';

const register = z.object({
  title: z
    .string(string)
    .min(1, 'deve ter pelo menos 1 caractere')
    .max(150, 'deve ter no máximo 200 caracteres'),
  description: z.string(string),
  teamId: z.int('deve ser um número'),
  status: z.enum(taskStatusEnum, {
    error: `deve ser ${Object.values(taskStatusEnum).join(', ')}`,
  }),
});

const edit = register
  .pick({
    name: true,
    color: true,
    isActive: true,
  })
  .partial();

export const taskSchema = {
  register,
  edit,
};
