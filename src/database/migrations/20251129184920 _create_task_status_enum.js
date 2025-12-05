export function up(knex) {
  return knex.raw(`
    CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'concluded');
  `);
}

export function down(knex) {
  return knex.raw(`DROP TYPE task_status;`);
}
