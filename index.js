const express = require("express");
const cors = require("cors");
const app = express();
const chatApi = require("./chat-api");

app.use(express.json());
app.use(cors());
const port = 5000;
const queueManager = new chatApi(port);

app.get("/", async (req, res) => {
  const message = req.query.message;

  try {
    // Send message and get the response as a stream
    const responseStream = await queueManager.sendMessage(message);

    // Set response headers
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Pipe the response stream to the client response
    responseStream.pipe(res);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
