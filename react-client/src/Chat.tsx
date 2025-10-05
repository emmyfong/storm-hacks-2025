import { useState } from "react";
import { useSocketContext } from "./SocketContext";
import './css/Chat.css'

export default function ChatModal() {
    const { sendChatMessage } = useSocketContext();
    const [modal, setChatModal] = useState(false);
    const [message, setMessage] = useState(""); // input text

    const toggleModal = () => {
        setChatModal(!modal)
    }

    const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault(); // Prevent the form from reloading the page
      if (message.trim()) {
          sendChatMessage(message.trim());
          setMessage(""); // Clear the input after sending
    }
  };

return (
    <>
      <div className="button-container">
        <button onClick={toggleModal}>Talk</button>
      </div>
      
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>Talk</h2>
            <form className="input-group" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="text-input"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="chat-send-button">Send</button>
            </form>
            <button onClick={toggleModal} className="chat-back-button">Back</button>
          </div>
        </div>
      )}
    </>
  );
}

