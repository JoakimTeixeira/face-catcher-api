import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import knex from "knex";

const database = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "joka",
    password: "root",
    database: "face-catcher",
  },
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
  database
    .select("*")
    .from("users")
    .then(users => {
      response.send(users);
    });
});

app.post("/signin", (request, response) => {
  database
    .select("email", "password")
    .from("login")
    .where("email", "=", request.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(
        request.body.password,
        data[0].password
      );

      if (isValid) {
        return database
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

  database
    .transaction(trx => {
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
    })
    .catch(err =>
      response.status(400).json(`Unable to register. ${err.detail}`)
    );
});

app.get("/profile/:id", (request, response) => {
  const { id } = request.params;

  database
    .select("*")
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
  database("users")
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
