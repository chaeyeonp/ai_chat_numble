import { useRouter } from "next/router";
import { ChatRoom } from "../../components/ChatRoom";

const ChatPage = () => {
  const router = useRouter();

  return <ChatRoom roomId={parseInt(router.query.roomId as string)} />;
};

export default ChatPage;
