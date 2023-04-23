import React from "react";

export function ChatMessage(props: { message: any, isCurrentUser: any }) {
  const { message, isCurrentUser } = props;
  const formatTimestamp = (timestamp: any) => {
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className={`message ${isCurrentUser ? "current-user" : "other-user"}`}>
      <img src={`/images/${message.image}`} alt={message.name} />
      <div className="message-info">
        <div className="message-sender">{message.name}</div>
        <div className="message-text">{message.text}</div>
        <div className="message-timestamp">
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
}
