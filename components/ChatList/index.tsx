import React, { useState, useEffect } from "react";
import { ChatRoom, createChatRoom, getAllChatRooms } from "../../database/Data";
import ListTable from "./components/ListTable";
import {
  CenteredForm,
  StyledInput,
  TitleTypography,
} from "../../styles/LoginForm.styles";
import CloseIcon from "../../public/icons/CloseIcon";
import PlusIcon from "../../public/icons/PlusIcon";
import {
  Container,
  Header,
  Logo,
  Button,
  Footer,
  CreateRoomButton,
  Content,
} from "../../styles/ChatList.styles";

const ChatRooms = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [updateData, setUpdateData] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [maxMembers, setMaxMembers] = useState(2);

  const changeData = () => {
    setUpdateData(!updateData);
  };

  const onCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await createChatRoom({
        name: roomName,
        maxMembers: maxMembers,
        messages: [],
      });
      changeData();
      setShowCreate(false);
    } catch (error) {
      console.error("Error in create chat room:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const rooms = await getAllChatRooms();
      if (rooms) {
        setChatRooms(rooms as ChatRoom[]);
      } else {
        setShowCreate(true);
      }
    };
    fetchData();
  }, [updateData]);

  const handleCreateRoom = () => {
    setShowCreate(true);
  };

  const handleCloseCreateDialog = () => {
    setShowCreate(false);
  };

  return (
    <Container>
      <Header>
        <Logo src={"images/numble_typo.png"} alt="Logo" />
        {showCreate ? (
          <Button onClick={handleCloseCreateDialog}>
            <CloseIcon width={30} height={30} />
          </Button>
        ) : (
          <Button disabled={showCreate} onClick={handleCreateRoom}>
            <PlusIcon width={30} height={30} />
          </Button>
        )}
      </Header>
      {showCreate ? (
        <>
          <CenteredForm>
            <TitleTypography>방 이름</TitleTypography>
            <StyledInput
              type="text"
              min={2}
              max={10}
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
            />
            <TitleTypography>방 인원</TitleTypography>
            <StyledInput
              type="number"
              value={maxMembers}
              onChange={e => setMaxMembers(parseInt(e.target.value))}
            />
          </CenteredForm>
          <Footer>
            <CreateRoomButton onClick={onCreate}>방 생성</CreateRoomButton>
          </Footer>
        </>
      ) : (
        <Content>
          <ListTable chatRooms={chatRooms} changeData={changeData} />
        </Content>
      )}
    </Container>
  );
};

export default ChatRooms;
