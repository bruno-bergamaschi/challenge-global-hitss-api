import { faker } from '@faker-js/faker';
import { taskStatusEnum } from '../../enums/task-status.enum.js';

export async function seed(knex) {
  const TEAMS_TO_CREATE = 1;
  const TASKS_PER_TEAM = 3;

  await knex.transaction(async (trx) => {
    const teamsToInsert = Array.from({ length: TEAMS_TO_CREATE }).map(() => {
      return {
        name: faker.company.name(),
        color: faker.color.rgb(),
      };
    });

    await trx('team').insert(teamsToInsert);

    const teamNames = teamsToInsert.map((team) => team.name);
    const teams = await trx('team')
      .whereIn('name', teamNames)
      .select('id', 'name');

    const statuses = Object.values(taskStatusEnum);
    const tasksToInsert = [];

    for (const team of teams) {
      for (let i = 0; i < TASKS_PER_TEAM; i++) {
        tasksToInsert.push({
          title: faker.lorem.paragraph({ min: 1, max: 1 }),
          description: faker.lorem.paragraph({ min: 1, max: 3 }),
          status: statuses[i] || taskStatusEnum.PENDING,
        });
      }

      const tasks = await trx('task').insert(tasksToInsert).returning('id');
      const teamsTasksToInsert = tasks.map((task) => {
        return { team_id: team.id, task_id: task.id };
      });

      await trx('team_task').insert(teamsTasksToInsert);
    }
  });
}
