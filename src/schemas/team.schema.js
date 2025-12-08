import { z } from 'zod';

const string = 'deve ser uma string';

const register = z.object({
  name: z
    .string(string)
    .min(1, 'deve ter pelo menos 1 caractere')
    .max(150, 'deve ter no máximo 150 caracteres'),
  color: z.string('Deve ser no formato #RRGGBB.').regex(/^#([A-Fa-f0-9]{6})$/, {
    message: 'Deve ser no formato #RRGGBB.',
  }),
});

const edit = register
  .pick({
    name: true,
    color: true,
  })
  .partial();

export const teamSchema = {
  register,
  edit,
};
