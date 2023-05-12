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
        try {
            const aiResponse = await OpenAI_API(text);
            if (aiResponse && inRoom) {
                // 채팅방에 있을 때만 AI가 응답
                addMessage(Number(id), {
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

            // 메시지를 보낸 후 refetch를 트리거
            refetchMessages();
        }

        addMessage(Number(id), {
            content: text,
            sender: "user",
            image: currentUser.image,
            name: currentUser.name,
            timestamp: new Date(),
        });
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
