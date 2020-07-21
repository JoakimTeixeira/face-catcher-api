import express from "express";
import bcrypt from "bcryptjs";
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
  db.select("email", "password")
    .from("login")
    .where("email", "=", request.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(
        request.body.password,
        data[0].password
      );

      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", request.body.email)
          .then(user => {
            response.json(user[0]);
          })
          .catch(err =>
            response
              .status(400)
              .json("Unable to get user signin data. Database not found")
          );
      }
    })
    .catch(err => response.status(400).json("Wrong credentials"));
});

app.post("/register", (request, response) => {
  const { name, email, password } = request.body;
  const hashedPassword = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx
      .insert({
        password: hashedPassword,
        email,
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name,
            joined: new Date(),
          })
          .then(user => {
            // returns the last registered user
            response.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err =>
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
    })
    .catch(err =>
      response
        .status(400)
        .json("Unable to get user profile. Database not found")
    );
});

app.put("/image", (request, response) => {
  const { id } = request.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      if (entries.length) {
        response.json(entries[0]);
      } else {
        response.status(400).json("User not found");
      }
    })
    .catch(err =>
      response.status(400).json("Unable to get entries. Database not found")
    );
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
