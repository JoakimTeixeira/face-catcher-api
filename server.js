import express from "express";

const app = express();
app.use(express.json());

const database = {
  users: [
    {
      id: "1",
      name: "John",
      email: "john@email.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "2",
      name: "Sally",
      email: "sally@email.com",
      password: "apple",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.send("This is working");
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("Success");
  } else {
    res.status("404").json("Error logging in");
  }
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
