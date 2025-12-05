import request from 'supertest';
import { faker } from '@faker-js/faker';
import app from '../../../src/app.js';
import { commonTestHooks } from '../../setup.tests.js';
import { registerRecord } from '../../helpers/database.helper.js';

commonTestHooks();

describe('Testando tudo sobre deletar um time', () => {
  let team = null;

  const makePayload = () => ({
    name: faker.company.name(),
    color: faker.color.rgb(),
  });

  beforeEach(async () => {
    team = await registerRecord('team', makePayload());
  });

  describe('Erros', () => {
    test('DELETE /teams/:id - deve retornar erro 404, porque o time com o ID informado não existe', async () => {
      const payload = {
        ...makePayload(),
      };

      const res = await request(app)
        .delete(`/teams/999`)
        .send(payload)
        .expect('Content-Type', /json/);

      expect(res.status).toBe(404);

      expect(res.body).toBeDefined();
      expect(res.body.code).toBeDefined();
      expect(res.body.message).toBeDefined();

      expect(res.body.code).toBe('404-entity-not-found');
      expect(res.body.message).toBe("Time com ID '999' não encontrado.");
    });
  });

  describe('Sucessos', () => {
    test('DELETE /teams - deve retornar 204 e deletar um time', async () => {
      const payload = makePayload();

      const res = await request(app).delete(`/teams/${team.id}`).send(payload);

      expect(res.status).toBe(204);
    });
  });
});
