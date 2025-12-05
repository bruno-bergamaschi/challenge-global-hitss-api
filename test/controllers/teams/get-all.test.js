import request from 'supertest';
import { faker } from '@faker-js/faker';
import app from '../../../src/app.js';
import { commonTestHooks } from '../../setup.tests.js';
import {
  getAllRecords,
  registerRecord,
} from '../../helpers/database.helper.js';

commonTestHooks();

describe('Testando tudo sobre obter todos os times', () => {
  let totalTeams = 15;
  let teams = [];

  const registerEntities = async () => {
    for (let i = 1; i <= totalTeams; i++) {
      const team = await registerRecord('team', {
        name: faker.company.name(),
        color: faker.color.rgb(),
      });

      teams.push(team);
    }
  };

  beforeAll(async () => {
    await registerEntities();
  });

  describe('Erros', () => {
    test('GET /teams - deve retornar erro 400, porque os parâmetros de paginação são inválidos', async () => {
      const res = await request(app)
        .get(`/teams`)
        .query({ page: 0, perPage: 0 })
        .expect('Content-Type', /json/);

      expect(res.status).toBe(400);

      expect(res.body).toBeDefined();
      expect(res.body.code).toBeDefined();
      expect(res.body.message).toBeDefined();

      expect(res.body.code).toBe('400-ivalid-pagination');
      expect(res.body.message).toBe('Parâmetros de paginação inválidos.');
    });

    test('GET /teams - deve retornar erro 400, porque os parâmetros de ordenação são inválidos', async () => {
      const res = await request(app)
        .get(`/teams`)
        .query({ orderBy: 'name | color', sortBy: 'ASC' })
        .expect('Content-Type', /json/);

      expect(res.status).toBe(400);

      expect(res.body).toBeDefined();
      expect(res.body.code).toBeDefined();
      expect(res.body.message).toBeDefined();

      expect(res.body.code).toBe('400-ivalid-pagination');
      expect(res.body.message).toBe('Parâmetros de ordenação inválidos.');
    });

    test('GET /teams - deve retornar erro 400, porque o valor de ordenação sortBy é inválido', async () => {
      const res = await request(app)
        .get(`/teams`)
        .query({ orderBy: 'name', sortBy: 'SORT' })
        .expect('Content-Type', /json/);

      expect(res.status).toBe(400);

      expect(res.body).toBeDefined();
      expect(res.body.code).toBeDefined();
      expect(res.body.message).toBeDefined();

      expect(res.body.code).toBe('400-ivalid-pagination');
      expect(res.body.message).toBe('SortBy inválido.');
    });
  });

  describe('Sucessos', () => {
    test('GET /teams - deve retornar 200 contendo todos os times', async () => {
      const { rows: teams } = await getAllRecords({
        tableName: 'team',
        columns: ['id', 'name', 'color'],
        customQuery: 'ORDER BY name ASC LIMIT 10 OFFSET 0',
      });

      const res = await request(app)
        .get(`/teams`)
        .expect('Content-Type', /json/);

      expect(res.status).toBe(200);

      expect(res.body).toBeDefined();

      expect(res.body.results).toBeDefined();
      expect(res.body.totalCount).toBeDefined();

      expect(res.body.results).toEqual(teams);
      expect(res.body.totalCount).toBe(totalTeams);

      const [entity] = res.body.results;

      expect(entity).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          name: expect.any(String),
        }),
      );
    });

    test('GET /teams - deve retornar 200 contendo um times filtrados por nome', async () => {
      const [teamFilter] = teams;

      const { rows } = await getAllRecords({
        tableName: 'team',
        columns: ['id', 'name', 'color'],
        customQuery: `WHERE name = '${teamFilter.name}' ORDER BY name ASC LIMIT 10 OFFSET 0`,
      });

      const [filteredTeam] = rows;

      const res = await request(app)
        .get(`/teams`)
        .query({ search: teamFilter.name })
        .expect('Content-Type', /json/);

      expect(res.status).toBe(200);

      expect(res.body).toBeDefined();

      expect(res.body.results).toBeDefined();
      expect(res.body.totalCount).toBeDefined();

      expect(res.body.results).toEqual([filteredTeam]);
      expect(res.body.totalCount).toBe(1);

      const [team] = res.body.results;

      expect(team.id).toBe(filteredTeam.id);
      expect(team.name).toBe(filteredTeam.name);
      expect(team.color).toBe(filteredTeam.color);
    });

    test('GET /teams - deve retornar 200 contendo os times da segunda página', async () => {
      const { rows: teams } = await getAllRecords({
        tableName: 'team',
        columns: ['id', 'name', 'color'],
        customQuery: `ORDER BY name ASC LIMIT 10 OFFSET 10`,
      });

      const res = await request(app)
        .get(`/teams`)
        .query({ page: 2, perPage: 10 })
        .expect('Content-Type', /json/);

      expect(res.status).toBe(200);

      expect(res.body).toBeDefined();

      expect(res.body.results).toBeDefined();
      expect(res.body.totalCount).toBeDefined();

      expect(res.body.results).toEqual(teams);
      expect(res.body.totalCount).toBe(totalTeams);
    });

    test('GET /teams - deve retornar 200 contendo os times em ordem decrescente por cor', async () => {
      const { rows: orderedTeams } = await getAllRecords({
        tableName: 'team',
        columns: ['id', 'name', 'color'],
        customQuery: 'ORDER BY color DESC',
      });

      const res = await request(app)
        .get(`/teams`)
        .query({
          page: 1,
          perPage: 20,
          orderBy: 'color',
          sortBy: 'DESC',
        })
        .expect('Content-Type', /json/);

      expect(res.status).toBe(200);

      expect(res.body).toBeDefined();

      expect(res.body.results).toBeDefined();
      expect(res.body.totalCount).toBeDefined();

      expect(res.body.results).toEqual(orderedTeams);
      expect(res.body.totalCount).toBe(totalTeams);
    });
  });
});
