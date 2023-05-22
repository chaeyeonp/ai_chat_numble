import React, {useState, useEffect, useRef} from "react";
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
  height: 70px;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1;
`;

const ChatFooter = styled.div`
  display: flex;
  align-items: center;
  height: 70px;
  padding: 0 20px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1;
`;

const ChatTitle = styled.h2`
  margin: 0;
  color: white;
  font-size: 24px;
  margin-left: 16px;
`;

const ChatContent = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  height: calc(100% - 140px);
  margin: 70px 0; /* 헤더의 높이만큼 컨테이너를 아래로 이동 */
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
    const [inRoom, setInRoom] = useState(true);
    const [room, setRoom] = useState<ChatRoomType | undefined>();
    const [refetch, setRefetch] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setAIUser({
            image: getRandomElement(profileImages),
            name: getRandomElement(nicknames),
        });

        const fetchRoom = async () => {
            if (id) {
                const fetchedRoom = await getOrCreateChatRoomById(
                    parseInt(id as string)
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
            setInRoom(false);
        };
    }, [id, refetch]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [room?.messages]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, []);

    const refetchMessages = () => {
        setRefetch((prev) => !prev);
    };

    const scrollToBottom = () => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
            console.log("scrollTop", container.scrollTop, "scrollHeight", container.scrollHeight);

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
            setInRoom(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const container = messagesContainerRef.current;
            if (container) {
                // 스크롤이 맨 아래로 도달했는지 확인
                const isScrolledToBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
                if (isScrolledToBottom) {
                    // 맨 아래에 도달했을 때만 scrollToBottom 호출
                    setTimeout(scrollToBottom, 50); // 약간의 딜레이 적용
                }
            }
        };

        const container = messagesContainerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
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
        <>
            <ChatHeader>
                <Button onClick={() => router.push("/chatlist")}>
                    <BackIcon width={30} height={30}/>
                </Button>
                <ChatTitle>{room.name}</ChatTitle>
            </ChatHeader>
            <ChatContent>
                <MessagesContainer ref={messagesContainerRef}>
                    {room.messages.map((message, index) => (
                        <ChatMessage
                            key={index}
                            message={message}
                            isCurrentUser={message.sender === "user"}
                        />
                    ))}
                </MessagesContainer>
            </ChatContent>
            <ChatFooter>
                <ChatInput onSendMessage={onSendMessage} onScrollToBottom={scrollToBottom}/>
            </ChatFooter>


        </>

    ) : (
        <RoomNotFound>Room not found</RoomNotFound>
    );
};
