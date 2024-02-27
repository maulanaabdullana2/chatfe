import { useState, useEffect } from "react";
import io from "socket.io-client";

import "./App.css";
const socket = io("https://chatrealtimes-92a9bf807df6.herokuapp.com/");

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

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
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (messageText || selectedImage) {
      const messageData = {
        username: username,
        message: messageText,
        image: selectedImage ? URL.createObjectURL(selectedImage) : null,
      };

      socket.emit("chat message", messageData);

      setMessageText("");
      setSelectedImage(null);
    }
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
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
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatApp;
