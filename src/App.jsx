// App.js
import { useEffect, useState } from "react";
import logo from "./assets/react.svg";
import "./App.css";
import axios from "axios";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8000/");


function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  
  useEffect(() => {
    socket.on("incoming message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    getMessages();
  }, [messages,socket]);

  const getMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/messages`,
      );
      setMessages(response.data.data.message);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleTextChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("chat message", { username: username, message: message });
    setMessage("");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="App-messages">
          {messages.map((msg, index) => (
            <div className="App-message" key={index}>
              <strong>
                {msg.username}: {msg.message}
              </strong>
            </div>
          ))}
        </div>
        <form className="App-control" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ backgroundColor: "white" }}
          />
          <input
            type="text"
            placeholder="Message..."
            value={message}
            onChange={handleTextChange}
          />
          <input className="App-button" type="submit" value="Send" />
        </form>
      </header>
    </div>
  );
}

export default App;
