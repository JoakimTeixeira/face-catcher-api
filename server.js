import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import knex from "knex";
import { handleRegister } from "./controllers/register.mjs";
import { handleSignin } from "./controllers/signin.mjs";
import { handleProfile } from "./controllers/profile.mjs";
import { handleApiCall, handleImage } from "./controllers/image.mjs";

const database = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
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

app.post("/signin", handleSignin(database, bcrypt));
app.post("/register", handleRegister(database, bcrypt));
app.get("/profile/:id", handleProfile(database));
app.put("/image", handleImage(database));
app.post("/imageUrl", handleApiCall());

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
