export function up(knex) {
  return knex.schema.createTable('task', (table) => {
    table.increments('id').primary();

    table.string('title', 250).notNullable();
    table.text('description').notNullable();

    table.integer('team_id').references('id').inTable('team').notNullable();
    table
      .enum('status', null, {
        useNative: true,
        enumName: 'task_status',
        existingType: true,
      })
      .notNullable()
      .defaultTo('pending');

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
  return knex.schema.dropTable('task');
}
