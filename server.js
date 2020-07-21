import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import knex from "knex";
import { handleRegister } from "./controllers/register.mjs";
import { handleSignin } from "./controllers/signin.mjs";
import { handleProfile } from "./controllers/profile.mjs";
import { handleImage } from "./controllers/image.mjs";

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

app.post("/signin", (request, response) =>
  handleSignin(request, response, database, bcrypt)
);

app.post("/register", (request, response) =>
  handleRegister(request, response, database, bcrypt)
);

app.get("/profile/:id", (request, response) =>
  handleProfile(request, response, database)
);

app.put("/image", (request, response) =>
  handleImage(request, response, database)
);

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
