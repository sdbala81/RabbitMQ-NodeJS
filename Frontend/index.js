const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 5005;

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Admissions Service at ${PORT}`);
});

app.post("/test", async (request, res) => {
  const { firstName, lastName, email, count } = request.body;

  for (let index = 0; index < count; index++) {
    let student = {
      firstName: `${firstName} ${index}`,
      lastName: `${lastName} ${index}`,
      email: `${email} ${index}`,
    };

    axios
      .post("http://localhost:5000/admissions", student)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return res.status(200).json({});
});
