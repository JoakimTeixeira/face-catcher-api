import Clarifai from "clarifai";

const app = new Clarifai.App({
  apiKey: `${process.env.CLARIFAI_KEY}`,
});

const handleApiCall = () => (request, response) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, request.body.input)
    .then(data => response.json(data))
    .catch(err => response.status(400).json("Could not connect to API"));
};

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

export { handleApiCall, handleImage };
