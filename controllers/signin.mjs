const handleSignin = (database, bcrypt) => (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json("Incorrect signin form submission");
  }

  database
    .select("email", "password")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].password);

      if (isValid) {
        return database
          .select("*")
          .from("users")
          .where("email", "=", email)
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
};

export { handleSignin };
