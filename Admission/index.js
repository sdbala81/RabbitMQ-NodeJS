const express = require("express");
const { connect, consume, sendToQueue } = require("./rabbitmsq");

const app = express();
const PORT = 5000;

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

connect().then(consume);

app.post("/admissions", async (request, response) => {
  const { firstName, lastName, email } = request.body;

  const student = {
    firstName,
    lastName,
    email,
  };

  sendToQueue(student);

  return response.status(200).json(student);
});

app.listen(PORT, () => {
  console.log(`Admissions Service at ${PORT}`);
});
