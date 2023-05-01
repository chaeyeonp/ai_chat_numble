const dbName = "chatDB";
const dbVersion = 1;

export interface ChatRoom {
  id?: number;
  name: string;
  maxMembers: number;
  createdAt?: Date;
  messages: Message[];
}

export interface Message {
  id?: number;
  sender: string;
  content: string;
  timestamp: Date;
  image: string;
}

async function openDB(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;

      const ChatRooms = db.createObjectStore("chatRooms", {
        keyPath: "id",
      });

      ChatRooms.createIndex("id", "id", { unique: true });
      ChatRooms.createIndex("name", "name", { unique: false });

      const Messages = db.createObjectStore("messages", {
        keyPath: "id",
      });
      Messages.createIndex("id", "id", { unique: true });
      Messages.createIndex("roomId", "roomId", { unique: false });
    };

    request.onsuccess = (e: Event) =>
      resolve((e.target as IDBOpenDBRequest).result);
    request.onerror = (e: Event) =>
      reject((e.target as IDBOpenDBRequest).error);
  });
}

export async function createChatRoom(room: Omit<ChatRoom, "id">) {
  const db = await openDB();
  const transaction = db.transaction("chatRooms", "readwrite");
  const store = transaction.objectStore("chatRooms");

  const request = store.add({ ...room, id: Date.now() });

  return new Promise((resolve, reject) => {
    request.onsuccess = (e: Event) => {
      resolve((e.target as IDBRequest).result);
    };

    request.onerror = (e: Event) => {
      reject((e.target as IDBRequest).error);
    };
  });
}

export async function updateChatRoom(room: {
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
      resolve();
    };
    request.onerror = () => {
      reject();
    };
  });
}

export async function getOrCreateChatRoomById(id: number): Promise<unknown> {
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

export async function deleteChatRoom(id: number): Promise<unknown> {
  const db = await openDB();
  const transaction = db.transaction("chatRooms", "readwrite");
  const store = transaction.objectStore("chatRooms");

  const request = store.delete(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = () => {
      reject();
    };
  });
}

async function saveChatRoom(room: ChatRoom): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    const db = await openDB();
    const transaction = db.transaction("chatRooms", "readwrite");
    const store = transaction.objectStore("chatRooms");

    const request = store.add(room);

    request.onsuccess = (e: Event) =>
      resolve((e.target as IDBRequest).result as number);
    request.onerror = (e: Event) => reject((e.target as IDBRequest).error);

    db.close();
  });
}

async function saveMessage(message: Message): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    const db = await openDB();
    const transaction = db.transaction("messages", "readwrite");
    const store = transaction.objectStore("messages");

    const request = store.add(message);

    request.onsuccess = (e: Event) =>
      resolve((e.target as IDBRequest).result as number);
    request.onerror = (e: Event) => reject((e.target as IDBRequest).error);

    db.close();
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

async function getMessages(roomId: number): Promise<unknown> {
  const db = await openDB();
  const transaction = db.transaction("chatRooms", "readonly");
  const store = transaction.objectStore("chatRooms");

  const request = store.get(roomId);

  return new Promise(async (resolve, reject) => {
    request.onsuccess = (e: Event) => {
      const room = (e.target as IDBRequest).result as ChatRoom | undefined;
      if (room) {
        const messages = room.messages || [];
        const sortedMessages = messages.sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
        );
        resolve(sortedMessages);
      } else {
        reject(new Error(`Room ${roomId} not found`));
      }
    };
    request.onerror = (e: Event) => {
      reject((e.target as IDBRequest).error);
    };
  });
}

export {
  saveChatRoom,
  saveMessage,
  addMessage,
  getMessages,
  openDB,
  getAllChatRooms,
};
