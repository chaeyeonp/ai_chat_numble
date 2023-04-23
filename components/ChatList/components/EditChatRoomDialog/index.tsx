// components/EditChatRoomDialog.tsx
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { ChatRoom, updateChatRoom } from "../../../../database/Data";
import { Input, Label } from "../../../../styles/ChatList.styles";

const EditChatRoomDialog = ({
                              onClose = () => {
                              },
                              changeData = () => {
                              },
                              room = { id: 1, name: "", maxMembers: 2 },
                            }: { onClose: () => void; changeData: () => void; room?: ChatRoom | undefined }) => {
  const [state, setState] = useState({
    name: room?.name || "",
    maxMembers: room?.maxMembers || 2,
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.type === "number" ? parseInt(e.target.value) : e.target.value,
    });
  };

  const handleUpdateRoom = async () => {
    const updatedRoom = { ...room, ...state };
    try {
      await updateChatRoom(updatedRoom);
      changeData();
      onClose();
    } catch (error) {
      console.error(`Error updating room with ID ${room?.id}:`, error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Edit Room</DialogTitle>
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
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleUpdateRoom}>Edit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditChatRoomDialog;
