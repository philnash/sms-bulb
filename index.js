const express = require("express");
const bodyParser = require("body-parser");
const SSE = require('express-sse');

const app = express();
const sse = new SSE();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/sms", (req, res) => {
  console.log(req.body.Body);
  const colorMatch = req.body.Body.match(/#[\dA-Fa-f]{6}/);
  if (colorMatch !== null) {
    const hexColor = colorMatch[0]
    const colorArray = hexColor.split("");
    const rgb = []
    for (let i = 0; i<3; i++) {
      rgb.push(parseInt(colorArray.splice(1,2).join(''),16));
    }
    sse.send(rgb);
    res.send(`<Response><Message>Changing the bulb to ${hexColor}</Message></Response>`);
  } else {
    res.send(`<Response><Message>I couldn't find a colour in your message!</Message></Response>`);
  }
});

app.get("/stream", sse.init);

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`The bulb app is listening on localhost:${port}`);
});
