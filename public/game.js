const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ws = new WebSocket(
  location.protocol === "https:"
    ? "wss://" + location.host
    : "ws://" + location.host
);

const player = { x: 300, y: 200 };
let players = {};
const keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

ws.onmessage = e => {
  players = JSON.parse(e.data);
};

function update() {
  if (keys["w"]) player.y -= 3;
  if (keys["s"]) player.y += 3;
  if (keys["a"]) player.x -= 3;
  if (keys["d"]) player.x += 3;

  ws.send(JSON.stringify({
    type: "move",
    player
  }));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Object.values(players).forEach(p => {
    ctx.fillStyle = "lime";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fill();
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
