import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ChatRoom } from "../../../../database/Data";

const ChatRoomsList = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchChatRooms() {
      const response = await fetch("/api/chatroom");
      const data = await response.json();
      setChatRooms(data);
    }

    fetchChatRooms();
  }, []);

  return (
    <div>
      <h1>Chat Rooms</h1>
      <ul>
        {chatRooms.map(room => (
          <li key={room.id}>
            {room.name} ({room.maxMembers})
          </li>
        ))}
      </ul>
      <button onClick={() => router.push("/create-chat-room")}>
        Create a Chat Room
      </button>
    </div>
  );
};

export default ChatRoomsList;
