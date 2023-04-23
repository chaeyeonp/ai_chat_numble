import {
  CustomTable,
  ModifyButton,
  TableHeader,
} from "../../../../styles/ChatList.styles";
import { ChatRoom } from "../../../../database/Data";
import { useState } from "react";
import EditChatRoomDialog from "../EditChatRoomDialog";
import { useRouter } from "next/router";

const ListTable = (props: { chatRooms: ChatRoom[], changeData: () => void }) => {
  const router = useRouter();

  const handleRowClick = (id: number) => {
    router.push(`/chatroom/${id}`);
  };

  const { chatRooms, changeData } = props;
  const [edit, setEdit] = useState<{ open: boolean, value: ChatRoom | undefined }>({
    open: false,
    value: undefined,
  });


  return (
    <>
      <CustomTable>
        <thead>
        <tr>
          <TableHeader>방 이름</TableHeader>
          <TableHeader>수정</TableHeader>
        </tr>
        </thead>
        <tbody>
        {chatRooms.map(chatRoom => (
          <tr key={chatRoom.id}
              onClick={() => chatRoom.id && handleRowClick(chatRoom.id)}>
            <td>{chatRoom.name}</td>
            <td>
              <ModifyButton onClick={(event) => {
                event.stopPropagation();
                setEdit({ open: true, value: chatRoom });
              }}>수정</ModifyButton>

            </td>
          </tr>
        ))}
        </tbody>
      </CustomTable>
      {edit.open &&
        <EditChatRoomDialog onClose={() => {
          setEdit({ open: false, value: undefined });
        }} room={edit.value} changeData={changeData} />
      }
    </>

  )
    ;
};

export default ListTable;
