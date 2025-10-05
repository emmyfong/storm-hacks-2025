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
          <div className="button-container">
            <button className="modal-button" onClick={toggleModal}>
            Talk
          </button>
          </div>

          
    
          {modal && (
            <div className="modal">
              <div onClick={toggleModal} className="overlay"></div>
              <div className="modal-content">
                <h1>Talk</h1>
    
                <div className="input-group">
                  <input
                    type="text"
                    className="text-input"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button type="submit" className="chat-send-button">
                    Send
                  </button>
                </div>
    
                <button onClick={toggleModal} className="chat-back-button">
                  Back
                </button>
              </div>
            </div>
          )}
        </>
      );
    }