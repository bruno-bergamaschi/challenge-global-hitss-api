import request from 'supertest';
import { faker } from '@faker-js/faker';
import app from '../../../src/app.js';
import { commonTestHooks } from '../../setup.tests.js';
import { registerRecord } from '../../helpers/database.helper.js';

commonTestHooks();

describe('Testando tudo sobre editar um aluno', () => {
  let team = null;

  const makePayload = () => ({
    name: faker.company.name(),
    color: faker.color.rgb(),
  });

  beforeEach(async () => {
    team = await registerRecord('team', makePayload());
  });

  describe('Erros', () => {
    test("PATCH /teams/:id - deve retornar erro 400, porque 'name' não é uma string", async () => {
      const payload = {
        ...makePayload(),
        name: faker.number.int(),
      };

      const res = await request(app)
        .patch(`/teams/${team.id}`)
        .send(payload)
        .expect('Content-Type', /json/);

      expect(res.status).toBe(400);

      expect(res.body).toBeDefined();
      expect(res.body.code).toBeDefined();
      expect(res.body.details).toBeDefined();
      expect(res.body.message).toBeDefined();

      expect(res.body.details).toBe("'name' deve ser uma string");
    });

    test("PATCH /teams/:id - deve retornar erro 400, porque 'name' deve ter pelo menos 1 caractere", async () => {
      const payload = {
        ...makePayload(),
        name: '',
      };

      const res = await request(app)
        .patch(`/teams/${team.id}`)
        .send(payload)
        .expect('Content-Type', /json/);

      expect(res.status).toBe(400);

      expect(res.body).toBeDefined();
      expect(res.body.code).toBeDefined();
      expect(res.body.details).toBeDefined();
      expect(res.body.message).toBeDefined();

      expect(res.body.details).toBe("'name' deve ter pelo menos 1 caractere");
    });

    test("PATCH /teams/:id - deve retornar erro 400, porque 'name' deve ter no máximo 200 caracteres", async () => {
      const payload = {
        ...makePayload(),
        name: faker.string.alphanumeric(201),
      };

      const res = await request(app)
        .patch(`/teams/${team.id}`)
        .send(payload)
        .expect('Content-Type', /json/);

      expect(res.status).toBe(400);

      expect(res.body).toBeDefined();
      expect(res.body.code).toBeDefined();
      expect(res.body.details).toBeDefined();
      expect(res.body.message).toBeDefined();

      expect(res.body.details).toBe("'name' deve ter no máximo 200 caracteres");
    });

    test("PATCH /teams/:id - deve retornar erro 400, porque 'color' é inválido", async () => {
      const payload = {
        ...makePayload(),
        color: faker.number.int(),
      };

      const res = await request(app)
        .patch(`/teams/${team.id}`)
        .send(payload)
        .expect('Content-Type', /json/);

      expect(res.status).toBe(400);

      expect(res.body).toBeDefined();
      expect(res.body.code).toBeDefined();
      expect(res.body.details).toBeDefined();
      expect(res.body.message).toBeDefined();

      expect(res.body.details).toBe(
        "'color' Cor inválida. Use o formato #RRGGBB.",
      );
    });

    test('PATCH /teams/:id - deve retornar erro 404, porque o time com o ID informado não existe', async () => {
      const payload = {
        ...makePayload(),
      };

      const res = await request(app)
        .patch(`/teams/999`)
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
    test('PATCH /teams - deve retornar 201 e editar um time', async () => {
      const payload = makePayload();

      const res = await request(app)
        .patch(`/teams/${team.id}`)
        .send(payload)
        .expect('Content-Type', /json/);

      expect(res.status).toBe(200);

      expect(res.body).toBeDefined();

      expect(res.body.id).toBe(team.id);
      expect(res.body.name).toBe(payload.name);
      expect(res.body.color).toBe(payload.color);
    });
  });
});
