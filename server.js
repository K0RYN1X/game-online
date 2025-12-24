const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

let players = {};

wss.on("connection", ws => {
  const id = Math.random().toString(36).slice(2, 7);

  players[id] = {
    x: Math.random() * 500,
    y: Math.random() * 300
  };

  ws.on("message", msg => {
    const data = JSON.parse(msg);
    if (data.type === "move") {
      players[id] = data.player;
    }
  });

  ws.on("close", () => {
    delete players[id];
  });

  const interval = setInterval(() => {
    ws.send(JSON.stringify(players));
  }, 50);

  ws.on("close", () => clearInterval(interval));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on", PORT);
});
