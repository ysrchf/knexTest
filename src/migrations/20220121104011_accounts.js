exports.up = async (knex) => {
  await knex.schema.createTable("account", (table) => {
    table.increments("accountId")
    table.integer("transactions").notNullable()
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTable("account")
}
