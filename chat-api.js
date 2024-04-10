const axios = require("axios");
const crypto = require("crypto");

/* Api for Chat With RTX */
/** 
 Description: This class is used to send a message to the RTX chat server and get the response.

 Usage:
    const port = 5000;
    const queueManager = new chatApi(port);
    queueManager
        .sendMessage(message)
        .then((response) => {
            console.log("Respuesta del servidor:", response);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
*/

class chatApi {
  constructor(port) {
    this.port = port;
    // this.baseUrl = `http://127.0.0.1:${this.port}`;
    // ?cookie=9067245e-37f3-487a-a434-44f18be5a857&__theme=dark
    this.baseUrl = "https://fc4d24ee9aa89bf6b0.gradio.live";
  }

  generateSessionHash() {
    const array = crypto.randomBytes(20); // 20 bytes is equivalent to 5 Uint32Array elements
    return Array.from(array)
      .map((val) => val.toString(16).padStart(2, "0"))
      .join("");
  }

  async joinQueue(sessionHash, fnIndex, chatData) {
    console.log("joinQueue:", sessionHash, fnIndex, chatData);
    const pythonObject = {
      data: chatData,
      event_data: null,
      fn_index: fnIndex,
      trigger_id: 46,
      session_hash: sessionHash,
    };

    const url = `${this.baseUrl}/queue/join?__theme=dark`;

    try {
      await axios.post(url, pythonObject);
    } catch (error) {
      throw error;
    }
  }

  async listenForUpdates(sessionHash) {
    const url = `${this.baseUrl}/queue/data?session_hash=${sessionHash}`;
    try {
      const response = await axios.get(url, { responseType: "stream" });
      console.log(response.data)
      return response.data
      const lines = response.data.split("\n");
      for (const line of lines) {
        if (line) {
          try {
            const data = JSON.parse(line.slice(5));

            console.log(data?.output?.data);
            if (data.msg === "process_completed") {
              return data.output.data[0][0][1];
            }
          } catch (e) {
            console.log("Parsing errors", e);
            // Ignore parsing errors
          }
        }
      }
      return "";
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(message) {
    const sessionHash = this.generateSessionHash();

    // await this.joinQueue(sessionHash, 30, []);
    // await this.listenForUpdates(sessionHash);

    // await this.joinQueue(sessionHash, 31, []);
    // await this.listenForUpdates(sessionHash);

    // await this.joinQueue(sessionHash, 32, ["", [], "AI model default", null]);
    // await this.listenForUpdates(sessionHash);

    // await this.joinQueue(sessionHash, 33, ["", []]);
    // await this.listenForUpdates(sessionHash);

    await this.joinQueue(sessionHash, 34, [[[message, null]], null]);
    return this.listenForUpdates(sessionHash);
  }
}

module.exports = chatApi;
