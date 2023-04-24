import React from "react";
import styled from "@emotion/styled";

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: calc(100vh - 100px);
  padding: 1rem;
`;

const Sender = styled.div`
  font-weight: bold;
`;

const Text = styled.div``;

const Timestamp = styled.div`
  margin-left: 0.5rem;
  color: #999;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 0.5rem;
  border-radius: 50%;
`;

const CurrentUserMessageContainer = styled(MessageContainer)`
  flex-direction: row-reverse;
`;

export function ChatMessage(props: { message: any, isCurrentUser: any }) {
  const { message, isCurrentUser } = props;
  const formatTimestamp = (timestamp: any) => {
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const Container = isCurrentUser ? CurrentUserMessageContainer : MessageContainer;

  return (
    <Container>
      <ProfileImage src={`/images/profile/${message.image}`} alt={message.name} />
      <div className="message-info">
        <Sender>{message.name}</Sender>
        <Text>{message.content}</Text>
        <Timestamp>{formatTimestamp(message.timestamp)}</Timestamp>
      </div>
    </Container>
  );
}
