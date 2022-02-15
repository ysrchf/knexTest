const express = require("express")
const { default: knex } = require("knex")
const morgan = require("morgan")
const knexfile = require("./knexfile.js")
const handleDBErrors = require("./handleDBErrors.js")
const UserModel = require("./models/UserModel.js")
const { Model } = require("objection")

const app = express()

// middleware
app.use(morgan("dev"))
app.use(express.json())

const db = knex(knexfile)
Model.knex(db)
// users
// CREATE
app.post("/users", async (req, res) => {
  const {
    body: { firstName, lastName, email },
  } = req

  try {
    const [user] = await db("user")
      .insert({
        firstName,
        lastName,
        email,
      })
      .returning("*")

    res.send(user)
  } catch (err) {
    const error = handleDBErrors(err)

    res.status(420).send({ error })
  }
})

// READ
// single
app.get("/users/:userId", async (req, res) => {
  const {
    params: { userId },
  } = req

  const user = await UserModel.query().findById(userId)

  if (!user) {
    res.status(404).send({ error: "no such user" })

    return
  }

  res.send(user)
})

// READ
// collection
app.get("/users", async (req, res) => {
  res.send(await db("user"))
})

// UPDATE
// full
app.put("/users/:userId", async (req, res) => {
  const {
    params: { userId },
    body: { firstName, lastName, email },
  } = req

  const [user] = await db("user").where({ id: userId })

  if (!user) {
    res.status(404).send({ error: "no such user" })

    return
  }

  await db("user").delete().where({ id: userId })

  const [updatedUser] = await db("user")
    .insert({
      id: user.id,
      firstName,
      lastName,
      email,
    })
    .returning("*")

  res.send(updatedUser)
})

// UPDATE
// partial
app.patch("/users/:userId", async (req, res) => {
  const {
    params: { userId },
    body: payload,
  } = req

  const [user] = await db("user").where({ id: userId })

  if (!user) {
    res.status(404).send({ error: "no such user" })

    return
  }
  console.log(user, payload)
  const [updatedUser] = await db("user")
    .update({
      ...user,
      ...payload,
    })
    .where({ id: userId })
    .returning("*")

  res.send(updatedUser)
})

// DELETE
app.delete("/users/:userId", async (req, res) => {
  const {
    params: { userId },
  } = req

  const [user] = await db("user").where({ id: userId })

  if (!user) {
    res.status(404).send({ error: "no such user" })

    return
  }

  await db("user").delete().where({ id: userId })

  res.send()
})

app.listen(3000, () => console.log("Listening on :3000"))
