const handleRegister = (database, bcrypt) => (request, response) => {
  const { name, email, password } = request.body;

  if (!email || !name || !password) {
    return response.status(400).json("Incorrect register form submission");
  }

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
};

export { handleRegister };
