import { useEffect, useState } from "react";
import logo from "./assets/react.svg";
import "./App.css";
import axios from "axios";
import io from "socket.io-client";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {

    getmessgae()

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

   const initSocket = async () => {
     const socket = io.connect(import.meta.env.VITE_SOCKET_URL);

     socket.on("connect", () => {
       console.log("Connected to socket");
     });

     socket.on("disconnect", () => {
       console.log("Disconnected from socket");
     });

     socket.on("incoming message", (msg) => {
       setMessages((prevMessages) => [...prevMessages, msg]);
     });

     setSocket(socket);
   };

  const getmessgae = async () =>{
     try {
        const response = await axios.get(
          `${import.meta.env.VITE_SOCKET_URL}/messages`,
        );
        const responseData = response.data;
        setMessages(responseData.data.message);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
  }

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
              <strong>{msg.username}:</strong> {msg.message}
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
