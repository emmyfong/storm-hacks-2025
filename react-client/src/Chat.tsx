import { useState } from "react";
import './css/Chat.css'

export default function ChatModal() {
    const [modal, setChatModal] = useState(false);
    const [message, setMessage] = useState(""); // input text

    const toggleModal = () => {
        setChatModal(!modal)
    }

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
    
                <form className="chat-form">
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