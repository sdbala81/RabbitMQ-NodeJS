const amqp = require("amqplib");

const express = require("express");

const app = express();
const PORT = 5001;

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
  await channel.assertQueue("USER_MANAGEMENT");
};

const consume = async () => {
  channel.consume("USER_MANAGEMENT", (msg) => {
    channel.ack(msg);

    let student = JSON.parse(msg.content.toString());

    console.log("create student in azure AD ", student);

    console.log("get student credentials from azure AD", student);

    channel.sendToQueue("NOTIFICATION", Buffer.from(JSON.stringify(student)));
  });
};

connect().then(consume);

app.listen(PORT, () => {
  console.log(`User Management Service at ${PORT}`);
});
