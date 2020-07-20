import express from "express";
import cors from "cors";

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
  const { name, email, password } = request.body;

  database.users.push({
    id: `${Math.floor(Math.random() * 1000 + 1)}`,
    name,
    email,
    password,
    entries: 0,
    joined: new Date(),
  });
  // returns the last registered user
  response.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (request, response) => {
  const { id } = request.params;
  let found = false;

  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return response.json(user);
    }
  });

  if (!found) {
    response.status(400).json("User not found");
  }
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
