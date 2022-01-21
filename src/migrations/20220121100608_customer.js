exports.up = async (knex) => {
  await knex.schema.createTable("clients", (table) => {
    table.increments("id")
    table.text("IBAN").notNullable()
    table.text("firstName").notNullable()
    table.text("lastName").notNullable()
    table.date("birthdate").notNullable()
    table.text("birthplace").notNullable()
    table.text("address_line_1").notNullable()
    table.text("address_line_2").notNullable()
    table.text("email").notNullable()
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table.text("phone").notNullable()
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTable("clients")
}
