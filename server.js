const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket"],
  },
});

app.use(express.json()); //arvuma postov uxarkacy stanalu hamar
const rooms = new Map();

app.get("/rooms/:id", (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get("users").values()],
        messages: [...rooms.get(roomId).get("messages").values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
});

app.post("/rooms", (req, res) => {
  const { roomId, userName } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ["users", new Map()],
        ["messages", []],
      ])
    );
  }
  res.send();
});

io.on("connection", (socket) => {
  //cankacac useri hamar arancin id-iov
  socket.on("ROOM:JOIN", ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get("users").set(socket.id, userName);
    const users = [...rooms.get(roomId).get("users").values()];
    socket.to(roomId).broadcast.emit("ROOM:SET_USERS", users);
  });

  socket.on("ROOM:NEW_MESSAGE", ({ roomId, userName, text }) => {
    const obj = {
      userName,
      text,
    };
    rooms.get(roomId).get("messages").push(obj);
    socket.to(roomId).broadcast.emit("ROOM:NEW_MESSAGE", obj);
  });

  socket.on("disconnect", () => {
    rooms.forEach((value, roomId) => {
      if (value.get("users").delete(socket.id)) {
        const users = [...value.get("users").values()];
        socket.to(roomId).broadcast.emit("ROOM:SET_USERS", users);
      }
    });
  });
  console.log("User connected", socket.id);
});

server.listen(3001, (err) => {
  if (err) throw Error(err);
  console.log("Server switched!!!");
});
