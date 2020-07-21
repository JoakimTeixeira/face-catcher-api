const handleProfile = (request, response, database) => {
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
};

export { handleProfile };
