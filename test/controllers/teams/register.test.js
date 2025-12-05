import request from 'supertest';
import { faker } from '@faker-js/faker';
import app from '../../../src/app.js';
import { commonTestHooks } from '../../setup.tests.js';
import {
  deleteRecordById,
  registerRecord,
} from '../../helpers/database.helper.js';

commonTestHooks();

describe('Testando tudo sobre registrar um time', () => {
  const makePayload = () => ({
    name: faker.company.name(),
    color: faker.color.rgb(),
  });

  describe('Erros', () => {
    test("POST /teams - deve retornar erro 400, porque 'name' não é uma string", async () => {
      const payload = {
        ...makePayload(),
        name: faker.number.int(),
      };

      const res = await request(app)
        .post('/teams')
        .send(payload)
        .expect('Content-Type', /json/);

      expect(res.status).toBe(400);

      expect(res.body).toBeDefined();
      expect(res.body.code).toBeDefined();
      expect(res.body.details).toBeDefined();
      expect(res.body.message).toBeDefined();

      expect(res.body.details).toBe("'name' deve ser uma string");
    });

    test("POST /teams - deve retornar erro 400, porque 'name' deve ter pelo menos 1 caractere", async () => {
      const payload = {
        ...makePayload(),
        name: '',
      };

      const res = await request(app)
        .post('/teams')
        .send(payload)
        .expect('Content-Type', /json/);

      expect(res.status).toBe(400);

      expect(res.body).toBeDefined();
      expect(res.body.code).toBeDefined();
      expect(res.body.details).toBeDefined();
      expect(res.body.message).toBeDefined();

      expect(res.body.details).toBe("'name' deve ter pelo menos 1 caractere");
    });

    test("POST /teams - deve retornar erro 400, porque 'name' deve ter no máximo 200 caracteres", async () => {
      const payload = {
        ...makePayload(),
        name: faker.string.alphanumeric(201),
      };

      const res = await request(app)
        .post('/teams')
        .send(payload)
        .expect('Content-Type', /json/);

      expect(res.status).toBe(400);

      expect(res.body).toBeDefined();
      expect(res.body.code).toBeDefined();
      expect(res.body.details).toBeDefined();
      expect(res.body.message).toBeDefined();

      expect(res.body.details).toBe("'name' deve ter no máximo 200 caracteres");
    });

    test("POST /teams - deve retornar erro 400, porque 'color' é inválido", async () => {
      const payload = {
        ...makePayload(),
        color: faker.number.int(),
      };

      const res = await request(app)
        .post('/teams')
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
  });

  describe('Sucessos', () => {
    test('POST /teams - deve retornar 201 e registrar um time', async () => {
      const payload = makePayload();

      const res = await request(app)
        .post('/teams')
        .send(payload)
        .expect('Content-Type', /json/);

      expect(res.status).toBe(201);

      expect(res.body).toBeDefined();
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe(payload.name);
      expect(res.body.color).toBe(payload.color);
    });
  });
});
