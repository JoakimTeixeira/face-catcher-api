const handleSignin = (database, bcrypt) => (request, response) => {
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
};

export { handleSignin };
