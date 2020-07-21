const handleImage = database => (request, response) => {
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
};

export { handleImage };
