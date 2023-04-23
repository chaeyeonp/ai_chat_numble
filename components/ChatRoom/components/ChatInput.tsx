import React, { useState } from "react";

export function ChatInput(props: { onSendMessage: any }) {
  const { onSendMessage } = props;
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };


  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="chat-input-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
}
