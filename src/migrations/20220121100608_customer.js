exports.up = async (knex) => {
  await knex.schema.createTable("user", (table) => {
    table.increments("id")
    table.text("firstName").notNullable()
    table.text("lastName").notNullable()
    table.text("email").notNullable()
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTable("user")
}
