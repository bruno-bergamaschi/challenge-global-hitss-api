import request from 'supertest';
import { faker } from '@faker-js/faker';
import app from '../../../src/app.js';
import { commonTestHooks } from '../../setup.tests.js';
import { registerRecord } from '../../helpers/database.helper.js';

commonTestHooks();

describe('Testando tudo sobre obter um time por ID', () => {
  let team = null;

  beforeEach(async () => {
    team = await registerRecord('team', {
      name: faker.company.name(),
      color: faker.color.rgb(),
    });
  });

  describe('Erros', () => {
    test('GET /teams/:id - deve retornar erro 404, porque o time com o ID informado não existe', async () => {
      const res = await request(app)
        .get(`/teams/999`)
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
    test('GET /teams/:id - deve retornar 200 contendo o objeto de um time', async () => {
      const res = await request(app)
        .get(`/teams/${team.id}`)
        .expect('Content-Type', /json/);

      expect(res.status).toBe(200);

      expect(res.body).toBeDefined();

      expect(res.body.id).toBe(team.id);
      expect(res.body.name).toBe(team.name);
      expect(res.body.color).toBe(team.color);
    });
  });
});
