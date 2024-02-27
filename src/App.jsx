import  { useState, useEffect } from "react";
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

    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageBase64 = reader.result;
        socket.emit("chat message", {
          username: username,
          message: "",
          image: imageBase64,
        });
      };
      reader.readAsDataURL(selectedImage);
      setSelectedImage(null);
    } else {
      socket.emit("chat message", {
        username: username,
        message: messageText,
        image: null,
      });
    }

    setMessageText("");
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      // Jika pengguna memilih gambar dari sistem file
      setSelectedImage(event.target.files[0]);
    } else if (event.dataTransfer && event.dataTransfer.files[0]) {
      // Jika pengguna memilih gambar dari drag and drop atau dari kamera
      const file = event.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          capture="camera"
        />
        <button type="submit">Send</button>
      </form>
      {selectedImage && (
        <img
          src={
            typeof selectedImage === "string"
              ? selectedImage
              : URL.createObjectURL(selectedImage)
          }
          alt="Selected"
        />
      )}
    </div>
  );
}

export default ChatApp;
