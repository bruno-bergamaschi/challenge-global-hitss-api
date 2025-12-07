export function up(knex) {
  return knex.schema.createTable('team_task', (table) => {
    table.increments('id').primary();

    table.integer('team_id').references('id').inTable('team').notNullable();
    table.integer('task_id').references('id').inTable('task').notNullable();

    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));

    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('deleted_at').nullable();
  });
}

export function down(knex) {
  return knex.schema.dropTable('team_task');
}
