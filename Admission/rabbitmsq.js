const amqp = require("amqplib");

var channel, connection;

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

const sendToQueue = (async = (data) => {
  channel.sendToQueue("ADMISSIONS", Buffer.from(JSON.stringify(data)));
});

module.exports = { connect, consume, sendToQueue };
