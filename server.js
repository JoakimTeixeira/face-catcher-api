import express from "express";
import cors from "cors";
import knex from "knex";

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "joka",
    password: "root",
    database: "face-catcher",
  },
});

// database test
db.select("*")
  .from("users")
  .then(data => {
    console.log(data);
  });

const app = express();
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@email.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@email.com",
      password: "apple",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (request, response) => {
  response.send(database.users);
});

app.post("/signin", (request, response) => {
  if (
    request.body.email === database.users[0].email &&
    request.body.password === database.users[0].password
  ) {
    response.json(database.users[0]);
  } else {
    response.status("404").json("Error logging in");
  }
});

app.post("/register", (request, response) => {
  const { name, email } = request.body;

  db("users")
    .returning("*")
    .insert({
      email,
      name,
      joined: new Date(),
    })
    .then(user => {
      // returns the last registered user
      response.json(user[0]);
    })
    .catch(err =>
      response.status(400).json(`Unable to register. ${err.detail}`)
    );
});

app.get("/profile/:id", (request, response) => {
  const { id } = request.params;

  db.select("*")
    .from("users")
    .where({ id })
    .then(user => {
      if (user.length) {
        response.json(user[0]);
      } else {
        response.status(400).json("User not found");
      }
    });
});

app.put("/image", (request, response) => {
  const { id } = request.body;
  let found = false;

  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;

      return response.json(user.entries);
    }
  });

  if (!found) {
    response.status(400).json("User not found");
  }
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
