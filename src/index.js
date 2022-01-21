const { join } = require("path")
const { readFile, writeFile, access, readdir } = require("fs/promises")
const {
  constants: { R_OK },
} = require("fs")
const express = require("express")
const morgan = require("morgan")

const app = express()

const DB_DIR = join(__dirname, "../db")

// middleware
app.use(morgan("dev"))
app.use(express.json())

const genNextId = async (resource) => {
  const filename = join(DB_DIR, resource, "lastId")
  const lastId = Number(await readFile(filename))

  await writeFile(filename, String(lastId + 1), { encoding: "utf-8" })

  return lastId + 1
}

// users
// CREATE
app.post("/users", async (req, res) => {
  const {
    body: { firstName, lastName, email },
  } = req

  const userId = await genNextId("users")
  const user = {
    id: userId,
    firstName,
    lastName,
    email,
  }
  const filename = join(DB_DIR, "users", `${userId}.json`)
  await writeFile(filename, JSON.stringify(user), { encoding: "utf-8" })

  res.send(user)
})

app.patch("/users/maj/:userId", async (req, res) => {
  const {
    body: { firstName, lastName },
    params: { userId },
  } = req

  const user = {
    id: Number(userId),
    firstName,
    lastName,
  }

  const filename = join(DB_DIR, "users", `${userId}.json`)

  await writeFile(filename, JSON.stringify(user), { encoding: "utf-8" })
  res.send(user)
})

// READ
// single
app.get("/users/:userId", async (req, res) => {
  const {
    params: { userId },
  } = req

  const filename = join(DB_DIR, "users", `${userId}.json`)

  try {
    await access(filename, R_OK)
  } catch (err) {
    res.status(404).send({ error: "no such user" })

    return
  }

  const buf = await readFile(filename, { encoding: "utf-8" })

  res.setHeader("Content-Type", "application/json").send(buf)
})

// READ
// collection
app.get("/users", async (req, res) => {
  const dbDir = join(DB_DIR, "users")
  const entries = await readdir(dbDir)
  const users = (
    await Promise.all(
      entries
        .filter((entry) => entry.endsWith(".json"))
        .map((entry) => join(dbDir, entry))
        .map((entry) => readFile(entry, { encoding: "utf-8" }))
    )
  ).map((data) => JSON.parse(data))

  res.send(users)
})

app.listen(3000, () => console.log("Listening on :3000"))
