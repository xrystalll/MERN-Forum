require("dotenv").config();
const mailjet = require("node-mailjet").connect(
  process.env.APIKEY_PUBLIC,
  process.env.APIKEY_PRIVATE
);

const sendEmail = () => {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "tribinnov@something.com",
          Name: "Tribinnov community",
        },
        To: [
          {
            Email: "user@gmail.com",
            Name: "username",
          },
        ],
        Subject: "Verify Email",
        HTMLPart: "<h2>...template here </h2> with link and token as well",
      },
    ],
  });

  return request;
  // request is a promise so chain the .then or use a try/catch block when calling
  /* 
    request.then((res) => {
        console.log(result.body)
    }).catch(err => console.log(err))
    */
};

module.export = { sendEmail };
