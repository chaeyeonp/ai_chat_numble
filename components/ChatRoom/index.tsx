import React, { useState, useEffect, useRef } from "react";
import {
  addMessage,
  ChatRoom as ChatRoomType,
  getOrCreateChatRoomById,
} from "../../database/Data";
import styled from "@emotion/styled";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { useRouter } from "next/router";
import { BackIcon } from "../../public/icons";
import Button from "@mui/material/Button";
import { OpenAI_API } from "./components/OpenAI_API";

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 98vh;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  height: 70px;
  padding: 0 20px;
  background-color: rgba(0, 0, 0, 0.8);
`;

const ChatFooter = styled.div`
  display: flex;
  align-items: center;
  height: 70px;
  padding: 0 20px;
  background-color: rgba(0, 0, 0, 0.8);
`;

const ChatTitle = styled.h2`
  color: white;
  font-size: 24px;
  margin: 0 0 0 16px;
`;

const ChatContent = styled.div`
  color: white;
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  height: calc(100% - 140px);
`;

const RoomNotFound = styled.div`
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const ChatRoom: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentUser, setCurrentUser] = useState({
    image: "",
    name: "",
  });
  const [room, setRoom] = useState<ChatRoomType | undefined>();
  const [refetch, setRefetch] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      if (id) {
        const fetchedRoom = await getOrCreateChatRoomById(
          parseInt(id as string),
        );

        if (fetchedRoom) {
          const typedFetchedRoom = fetchedRoom as ChatRoomType;
          setRoom(typedFetchedRoom);
          setCurrentUser({
            image: "default_user.png",
            name: typedFetchedRoom.name ?? "default_user",
          });
        }
      }
    };

    fetchRoom();

    return () => {};
  }, [id, refetch]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [room?.messages]);

  const refetchMessages = () => {
    setRefetch(prev => !prev);
  };

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  const onSendMessage = async (text: string) => {
    refetchMessages();

    if (text.length > 500) {
      alert("Message is too long! Please limit to 500 characters.");
      return;
    }

    try {
      addMessage(Number(id), {
        content: text,
        sender: "user",
        image: currentUser.image,
        name: currentUser.name,
        timestamp: new Date(),
      });
      await OpenAI_API(text, room?.id ?? 0, room?.maxMembers ?? 0);
      refetchMessages();
    } catch (error) {
      console.error("Error while sending message:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const container = messagesContainerRef.current;
      if (container) {
        // Check if the scroll is at the bottom
        const isScrolledToBottom =
          container.scrollHeight - container.scrollTop ===
          container.clientHeight;
        if (isScrolledToBottom) {
          // Call scrollToBottom only when scrolled to the bottom
          setTimeout(scrollToBottom, 50); // Apply a slight delay
        }
      }
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    // Remove the event listener when the component is unmounted
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [room?.messages]);

  useEffect(() => {
    scrollToBottom();
  }, [room]);

  return room ? (
    <ChatContainer>
      <ChatHeader>
        <Button onClick={() => router.push("/chatlist")}>
          <BackIcon width={30} height={30} />
        </Button>
        <ChatTitle>{room.name}</ChatTitle>
      </ChatHeader>
      <ChatContent ref={messagesContainerRef}>
        {room.messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isCurrentUser={message.sender === "user"}
          />
        ))}
      </ChatContent>
      <ChatFooter>
        <ChatInput
          onSendMessage={onSendMessage}
          onScrollToBottom={scrollToBottom}
        />
      </ChatFooter>
    </ChatContainer>
  ) : (
    <RoomNotFound>Room not found</RoomNotFound>
  );
};
