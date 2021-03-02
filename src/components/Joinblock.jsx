import React, { useState } from "react";
import classes from "./Joinblock.module.css";
import axios from "axios";

export const Joinblock = ({ onLogin }) => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  const onEnter = async () => {
    if (!roomId || !userName) {
      alert("Something empty");
      return;
    }
    setLoading(true);
    const obj = { roomId, userName };
    await axios.post("/rooms", obj);
    onLogin(obj);

    setRoomId("");
    setUserName("");
  };
  return (
    <div className={classes.form}>
      <input
        type="text"
        placeholder="Room id"
        value={roomId}
        onChange={(event) => setRoomId(event.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Name"
        value={userName}
        onChange={(event) => setUserName(event.target.value)}
      />
      <br />
      <button onClick={onEnter} disabled={loading}>
        {loading ? "Join..." : "Join"}
      </button>
    </div>
  );
};
