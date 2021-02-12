const accountSid = process.env.SID;
const authToken = process.env.AUTH;
const client = require("twilio")(accountSid, authToken);

const get = (name, city, date, time) => {
  client.messages
    .create({
      body: `New event ${name} is coming up in ${city} on ${date} at ${time}. Visit the app for more info. Keep it clean <3`,
      from: `whatsapp:${process.env.TWILIO_NUMBER}`,
      to: `whatsapp:${process.env.NUMBER}`,
    })
    .then((message) => console.log(message.sid))
    .done();
};

module.exports = get;
