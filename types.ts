export type Chat = {
  id: string;
  roomId: string;
  role: string;
  message: string;
  name: number;
  time: Date;
};

export type CreateChatRoomParams = {
  id?: string;
  name: string;
  memberCount: number;
};
export type CreateChatParams = Omit<Chat, "time">;

export type Response = {
  result: boolean;
  data?: any;
  message?: string;
};

export type IconProps = {
  width?: string | number;
  height?: string | number;
};
