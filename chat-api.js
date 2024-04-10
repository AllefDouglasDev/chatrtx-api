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
      return response.data
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(message) {
    const sessionHash = this.generateSessionHash();
    await this.joinQueue(sessionHash, 34, [[[message, null]], null]);
    return this.listenForUpdates(sessionHash);
  }
}

module.exports = chatApi;
