exports.up = async (knex) => {
  await knex.schema.createTable("creditCards", (table) => {
    table.increments("ccId")
    table.integer("expirationDate").notNullable()
    table.integer("ccv").notNullable()
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTable("creditCards")
}
