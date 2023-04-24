// components/EditChatRoomDialog.tsx
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { ChatRoom, deleteChatRoom, updateChatRoom } from "../../../../database/Data";
import { Input, Label, StyledDialogTitle } from "../../../../styles/ChatList.styles";
import CloseIcon from "../../../../public/icons/CloseIcon";
import { Typography } from "@mui/material";

const EditChatRoomDialog = ({
                              onClose = () => {
                              },
                              changeData = () => {
                              },
                              room,
                            }: { onClose: () => void; changeData: () => void; room?: ChatRoom | undefined }) => {
  const [state, setState] = useState({
    name: room?.name || "",
    maxMembers: room?.maxMembers || 2,
    message:[]
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.type === "number" ? parseInt(e.target.value) : e.target.value,
    });
  };

  const handleUpdateRoom = async () => {
    const updatedRoom = { ...room, ...state, };
    try {
      await updateChatRoom(updatedRoom);
      changeData();
      onClose();
    } catch (error) {
      console.error(`Error updating room with ID ${room?.id}:`, error);
    }
  };


  const handleDeleteChatRoom = async (id: number) => {
    await deleteChatRoom(id);
    changeData();
    onClose();
  };

  if (!room) return <div></div>;

  return (
    <Dialog open={true} onClose={onClose}>
      <StyledDialogTitle>
        <Typography>Edit Page</Typography>
        <Button onClick={onClose}><CloseIcon width={40} height={40} />
        </Button></StyledDialogTitle>
      <DialogContent>
        <Label>
          방 이름
          <Input
            type="text"
            name="name"
            min={2}
            max={10}
            value={state.name}
            onChange={handleChange}
          />
        </Label>
        <Label>
          방 인원 (2-5):
          <Input
            type="number"
            name="maxMembers"
            min={2}
            max={5}
            value={state.maxMembers}
            onChange={handleChange}
          />
        </Label>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          if(room.id){
            handleDeleteChatRoom(room.id);

          }
        }
        }>Delete</Button>
        <Button onClick={handleUpdateRoom}>Edit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditChatRoomDialog;
