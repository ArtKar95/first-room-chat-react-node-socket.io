import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";
import classes from "./chat.module.css";

const Chat = ({ users, messages, userName, roomId, addMessage }) => {
  const [messageValue, setMessageValue] = useState();
  const messageRef = useRef(null);

  useEffect(() => {
    messageRef.current.scroll(0, messageRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = () => {
    if (messageValue) {
      socket.emit("ROOM:NEW_MESSAGE", {
        userName,
        text: messageValue,
        roomId,
      });

      addMessage({ userName, text: messageValue });
      setMessageValue("");
    }
  };

  document.addEventListener("keydown", function (event) {
    console.log(event.which);
  });
  return (
    <div className={classes.chatBlock}>
      <div className={classes.onlineUsers}>
        <h3>Room: {roomId}</h3>
        <hr />
        <b>Online {users.length}</b>
        <ul>
          {users.map((item, index) => (
            <li key={item + index}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <div className={classes.messages}>
          <div className={classes.messagesBlock} ref={messageRef}>
            {messages.map((message, index) => (
              <div key={index}>
                <p
                  className={
                    message.userName === userName
                      ? classes.myMessages
                      : classes.othersMessages
                  }
                >
                  {message.text}
                </p>
                <label
                  className={
                    message.userName === userName
                      ? classes.myLables
                      : classes.othersLables
                  }
                >
                  {message.userName !== userName ? message.userName : "Me"}
                </label>
              </div>
            ))}
          </div>

          <form action="">
            <textarea
              rows={3}
              cols={50}
              value={messageValue}
              onChange={(event) => setMessageValue(event.target.value)}
            ></textarea>
            <button type="button" onClick={sendMessage}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
