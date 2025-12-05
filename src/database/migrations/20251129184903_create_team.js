export function up(knex) {
  return knex.schema.createTable('team', (table) => {
    table.increments('id').primary();

    table.string('name', 150).notNullable();
    table.string('color', 7).notNullable();

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
  return knex.schema.dropTable('team');
}
