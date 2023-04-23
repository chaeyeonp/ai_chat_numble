import React, { useState, useEffect, useRef } from "react";
import { nicknames, profileImages } from "./utils/profileData";
import OpenAI_API from "./components/OpenAI_API";
import { addMessage, Message, ChatRoom as ChatRoomType, getOrCreateChatRoomById } from "../../database/Data";
import styled from "@emotion/styled";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";

interface Props {
  roomId: number;
}

function getRandomElement(array: any[]): any {
  return array[Math.floor(Math.random() * array.length)];
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 1rem;
  flex-grow: 1;
`;

const RoomNotFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const ChatRoom: React.FC<Props> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState({
    image: "",
    name: "",
  });
  const [aiUser, setAIUser] = useState({
    image: "",
    name: "",
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [inRoom, setInRoom] = useState(true); // 채팅방에 있는지 여부를 저장하는 상태 변수
  const [room, setRoom] = useState<ChatRoomType | undefined>();

  useEffect(() => {
    setCurrentUser({
      image: getRandomElement(profileImages),
      name: getRandomElement(nicknames),
    });

    setAIUser({
      image: getRandomElement(profileImages),
      name: getRandomElement(nicknames),
    });

    const fetchRoom = async () => {
      if(roomId){
        const fetchedRoom = await getOrCreateChatRoomById(roomId);
        if (fetchedRoom) {
          setRoom(fetchedRoom);
          setInRoom(true);
        } else {
          setInRoom(false);
        }
      }
    };

    fetchRoom();

    return () => {
      // 채팅방에서 나갈 때 필요한 작업 수행
      setInRoom(false);
    };
  }, [roomId]);


  const onSendMessage = async (text: string) => {
    try {
      const aiResponse = await OpenAI_API(text);
      if (aiResponse && inRoom) {
        // 채팅방에 있을 때만 AI가 응답
        addMessage(Number(roomId), {
          content: aiResponse,
          sender: "ai",
          image: aiUser.image,
          name: aiUser.name,
          timestamp: new Date(),
        });
      } else {
        throw new Error("API error or not in room");
      }
    } catch (error) {
      console.error("Error while sending message:", error);
      // 채팅방에서 에러 발생 시 일시 중지 및 오류 처리 로직
      // 이 경우에는 채팅방을 일시 중지하고, 다시 대화방에 들어오면 호출을 재개
      setInRoom(false);
    }

    addMessage(Number(roomId), {
      content: text,
      sender: "user",
      image: currentUser.image,
      name: currentUser.name,
      timestamp: new Date(),
    });
  };


  return room ? (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isCurrentUser={message.sender === "user"}
          />
        ))}
        <div ref={chatEndRef} />
      </MessagesContainer>
      <ChatInput onSendMessage={onSendMessage} />
    </ChatContainer>
  ) : (
    <RoomNotFound>Room not found</RoomNotFound>
  );
};
