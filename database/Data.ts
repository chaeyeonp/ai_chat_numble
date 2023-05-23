const dbName = "chatDB";
const dbVersion = 1;

export interface ChatRoom {
  id?: number; // 채팅방의 고유 ID
  name: string; // 채팅방 이름
  maxMembers: number; // 최대 참여 멤버 수
  createdAt?: Date; // 채팅방 생성 시간
  messages: Message[]; // 채팅 메시지 목록
}

export interface Message {
  id?: number; // 메시지의 고유 ID
  sender: string; // 발신자
  content: string; // 메시지 내용
  timestamp: Date; // 메시지 전송 시간
  image: string; // 이미지 URL
}

// 객체 스토어에 접근할 수 있는 IDBDatabase 객체를 반환하는 함수 (데이터를 읽고 쓸 수 있게 함)
async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      // 데이터베이스 스키마를 업그레이드할 때 실행되는 콜백 함수
      const db = (e.target as IDBOpenDBRequest).result;

      // "chatRooms"라는 객체 저장소 생성
      const ChatRooms = db.createObjectStore("chatRooms", {
        keyPath: "id", // ID를 기본 키로 사용
      });

      // "id"와 "name" 필드를 기준으로 인덱스 생성
      ChatRooms.createIndex("id", "id", { unique: true });
      ChatRooms.createIndex("name", "name", { unique: false });
    };

    request.onsuccess = (e: Event) =>
      resolve((e.target as IDBOpenDBRequest).result); // 데이터베이스 열기 성공 시 해결(resolve)
    request.onerror = (e: Event) =>
      reject((e.target as IDBOpenDBRequest).error); // 데이터베이스 열기 실패 시 거부(reject)
  });
}

async function createChatRoom(room: Omit<ChatRoom, "id">) {
  const db = await openDB();
  const transaction = db.transaction("chatRooms", "readwrite");
  const store = transaction.objectStore("chatRooms");
  // TODO : uuid
  const request = store.add({ ...room });

  return new Promise((resolve, reject) => {
    request.onsuccess = (e: Event) => {
      resolve((e.target as IDBRequest).result);
    };

    request.onerror = (e: Event) => {
      reject((e.target as IDBRequest).error);
    };
  });
}

async function updateChatRoom(room: {
  maxMembers: number;
  name: string;
  message: any[];
}): Promise<unknown> {
  const db = await openDB();
  const transaction = db.transaction("chatRooms", "readwrite");
  const store = transaction.objectStore("chatRooms");

  const request = store.put(room);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(null);
    };
    request.onerror = () => {
      reject(null);
    };
  });
}

async function getOrCreateChatRoomById(id: number): Promise<unknown> {
  const db = await openDB();
  const transaction = db.transaction("chatRooms", "readwrite");
  const store = transaction.objectStore("chatRooms");
  const request = store.get(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = (e: Event) => {
      const result = (e.target as IDBRequest).result;
      if (result) {
        if (!result.messages) {
          result.messages = [];
        }
        resolve(result);
      } else {
        const newRoom: ChatRoom = {
          name: "My New Room",
          maxMembers: 100,
          createdAt: new Date(),
          messages: [],
        };
        const addRequest = store.add(newRoom);
        addRequest.onsuccess = () => {
          resolve(newRoom);
        };
        addRequest.onerror = e => {
          reject((e.target as IDBRequest).error);
        };
      }
    };

    request.onerror = e => {
      reject((e.target as IDBRequest).error);
    };
  });
}

async function deleteChatRoom(id: number): Promise<unknown> {
  const db = await openDB();
  const transaction = db.transaction("chatRooms", "readwrite");
  const store = transaction.objectStore("chatRooms");

  const request = store.delete(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(null);
    };
    request.onerror = () => {
      reject();
    };
  });
}

// 채팅방 전체 목록 불러오기 함수
async function getAllChatRooms(): Promise<unknown> {
  const db = await openDB();
  const transaction = db.transaction("chatRooms", "readonly");
  const store = transaction.objectStore("chatRooms");

  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = (e: Event) => {
      resolve((e.target as IDBRequest).result);
    };

    request.onerror = (e: Event) => {
      reject((e.target as IDBRequest).error);
    };
  });
}

async function addMessage(
  roomId: number,
  message: Omit<Message, "id"> & { name: string },
): Promise<unknown> {
  const db = await openDB();
  const transaction = db.transaction("chatRooms", "readwrite");
  const store = transaction.objectStore("chatRooms");

  const request = store.get(roomId);

  return new Promise(async (resolve, reject) => {
    request.onsuccess = (e: Event) => {
      const room = (e.target as IDBRequest).result as ChatRoom | undefined;
      if (room) {
        const messages = room.messages || [];
        const newMessage = {
          ...message,
          id: Date.now(),
          timestamp: new Date(),
        };
        messages.push(newMessage);
        room.messages = messages.sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
        );
        const putRequest = store.put(room);
        putRequest.onsuccess = (e: Event) => {
          resolve(newMessage.id);
        };
        putRequest.onerror = (e: Event) => {
          reject((e.target as IDBRequest).error);
        };
      } else {
        reject(new Error(`Room ${roomId} not found`));
      }
    };
  });
}

export {
  addMessage,
  openDB,
  getAllChatRooms,
  updateChatRoom,
  createChatRoom,
  deleteChatRoom,
  getOrCreateChatRoomById,
};
