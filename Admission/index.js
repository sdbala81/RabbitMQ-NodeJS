const amqp = require("amqplib");

const express = require("express");

const app = express();
const PORT = 5000;

var connection, channel;

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

const connect = async () => {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("ADMISSIONS");
};

const consume = async () => {
  channel.consume("ADMISSIONS", (msg) => {
    channel.ack(msg);

    let student = JSON.parse(msg.content.toString());

    console.log("Add student to enrollment in database", student);

    console.log("Add student to student table in database", student);

    channel.sendToQueue(
      "USER_MANAGEMENT",
      Buffer.from(JSON.stringify(student))
    );
  });
};

connect().then(consume);

app.post("/admissions", async (request, response) => {
  const { firstName, lastName, email } = request.body;

  const student = {
    firstName,
    lastName,
    email,
  };

  channel.sendToQueue("ADMISSIONS", Buffer.from(JSON.stringify(student)));

  return response.status(200).json(student);
});

app.listen(PORT, () => {
  console.log(`Admissions Service at ${PORT}`);
});
