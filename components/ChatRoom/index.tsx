import React, {useState, useEffect} from "react";
import {nicknames, profileImages} from "./utils/profileData";
import {
    addMessage,
    ChatRoom as ChatRoomType,
    getOrCreateChatRoomById,
} from "../../database/Data";
import styled from "@emotion/styled";
import {ChatMessage} from "./components/ChatMessage";
import {ChatInput} from "./components/ChatInput";
import {useRouter} from "next/router";
import {BackIcon} from "../../public/icons";
import Button from "@mui/material/Button";
import {OpenAI_API} from "./components/OpenAI_API";

function getRandomElement(array: any[]): any {
    return array[Math.floor(Math.random() * array.length)];
}

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  //background-color: #212121;
  height: 80px;
  padding: 0 20px;
`;

const ChatTitle = styled.h2`
  margin: 0;
  color: white;
  font-size: 24px;
  margin-left: 16px;
`;

const ChatContainer = styled.div`
  color: white;
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
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const ChatRoom: React.FC = () => {
    const router = useRouter();
    const {id} = router.query;
    const [currentUser, setCurrentUser] = useState({
        image: "",
        name: "",
    });
    const [aiUser, setAIUser] = useState({
        image: "",
        name: "",
    });
    const [inRoom, setInRoom] = useState(true); // 채팅방에 있는지 여부를 저장하는 상태 변수
    const [room, setRoom] = useState<ChatRoomType | undefined>();
    const [refetch, setRefetch] = useState(false);

    useEffect(() => {
        setAIUser({
            image: getRandomElement(profileImages),
            name: getRandomElement(nicknames),
        });

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
    }, [id, refetch]);

    const refetchMessages = () => {
        setRefetch(prev => !prev);
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
            // setErrorMessage("Error while sending message. Please try again later.");
            setInRoom(false);
        } finally {
            // setLoading(false);
        }
    };

    return room ? (
        <ChatContainer>
            <ChatHeader>
                {/*<img src="icon.png" alt="icon" />*/}
                <Button onClick={() => router.push("/chatlist")}>
                    <BackIcon width={30} height={30}/>
                </Button>
                <ChatTitle>{room.name}</ChatTitle>
            </ChatHeader>
            <MessagesContainer>
                {room.messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        message={message}
                        isCurrentUser={message.sender === "user"}
                    />
                ))}
            </MessagesContainer>
            <ChatInput onSendMessage={onSendMessage}/>
        </ChatContainer>
    ) : (
        <RoomNotFound>Room not found</RoomNotFound>
    );
};
