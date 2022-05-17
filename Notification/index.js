const amqp = require("amqplib");

const express = require("express");

const app = express();
const PORT = 5002;

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
  await channel.assertQueue("NOTIFICATION");
};

const consume = async () => {
  channel.consume("NOTIFICATION", (msg) => {
    channel.ack(msg);

    let student = JSON.parse(msg.content.toString());

    console.log("send email out to student ", student);

    console.log("send sms out to student", student);

    //channel.sendToQueue("ADMISSIONS", Buffer.from(JSON.stringify(student)));
  });
};

connect().then(consume);

app.listen(PORT, () => {
  console.log(`NOTIFICATION Service at ${PORT}`);
});
