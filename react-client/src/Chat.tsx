import { useState } from "react";
import './css/Chat.css'

export default function ChatModal() {
    const [modal, setChatModal] = useState(false);
    const [message, setMessage] = useState(""); // input text
    const [messages, setMessages] = useState<string[]>([]); // message list

    const toggleModal = () => {
        setChatModal(!modal)
    }

    // Handle sending message
    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === "") return;

    setMessages((prev) => [...prev, message]);
    setMessage("");
  };

    return (
        <>
          <button className="modal-button" onClick={toggleModal}>
            Talk
          </button>
    
          {modal && (
            <div className="modal">
              <div onClick={toggleModal} className="overlay"></div>
              <div className="modal-content">
                <h2>Talk</h2>
    
                <form onSubmit={handleSubmit} className="chat-form">
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button type="submit" className="chat-send-button">
                    Send
                  </button>
                </form>
    
                <button onClick={toggleModal} className="chat-back-button">
                  Back
                </button>
              </div>
            </div>
          )}
        </>
      );
    }