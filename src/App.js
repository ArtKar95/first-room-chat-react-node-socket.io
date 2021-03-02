import { useReducer, useEffect } from "react";
import "./App.css";
import Chat from "./components/chat";
import { Joinblock } from "./components/Joinblock";
import { reduser } from "./reduser";
import socket from "./socket";
import axios from "axios";

function App() {
  const [state, dispatch] = useReducer(reduser, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  });

  const onLogin = async (obj) => {
    dispatch({
      type: "JOINED",
      payload: obj,
    });

    socket.emit("ROOM:JOIN", obj);
    const { data } = await axios.get(`/rooms/${obj.roomId}`);
    dispatch({
      type: "GET_OLD_MESSAGES",
      payload: data,
    });
  };

  const setUsers = (users) => {
    dispatch({
      type: "SET_USERS",
      payload: users,
    });
  };

  const addMessage = (message) => {
    dispatch({
      type: "NEW_MESSAGE",
      payload: message,
    });
  };

  useEffect(() => {
    socket.on("ROOM:SET_USERS", setUsers);
    socket.on("ROOM:NEW_MESSAGE", addMessage);
  }, []);

  window.socket = socket;
  return (
    <div className="App">
      {!state.joined ? (
        <Joinblock onLogin={onLogin} />
      ) : (
        <Chat {...state} addMessage={addMessage} />
      )}
    </div>
  );
}

export default App;
