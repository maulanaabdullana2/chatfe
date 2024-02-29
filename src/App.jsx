import { useState, useEffect } from "react";
import io from "socket.io-client";

import "./App.css";
const socket = io("https://chatrealtimes-80332f93dbf3.herokuapp.com/");


function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    socket.emit("get messages");

    socket.on("messages", (messages) => {
      setMessages(messages);
    });

    socket.on("incoming message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("messages");
      socket.off("incoming message");
    };
  },[] );

  const handleSubmit = (event) => {
    event.preventDefault();

    socket.emit("chat message", {
      username: username,
      message: messageText,
      image: null,
    });

    setMessageText("");
  };


  return (
    <div className="chat-container">
      <h1>Chat App</h1>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <p>
              <strong>{msg.username}:</strong> {msg.message}
            </p>
            {msg.image && (
              <img src={msg.image} alt="Chat" className="chat-image" />
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Masukan Nama Anda"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Pesan"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatApp;
