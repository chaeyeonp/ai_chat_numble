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

// 1. 데이터 베이스를 연다 (openDB)
// 2. 객체 저장소에 대한 쓰기 트랜잭션 시작

// 객체 스토어에 접근할 수 있는 IDBDatabase 객체를 반환하는 함수 (데이터를 읽고 쓸 수 있게 함)
async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      // 데이터베이스 스키마를 업그레이드할 때 실행되는 콜백 함수
      const db = (e.target as IDBOpenDBRequest).result;

      // "chatRooms"라는 객체 저장소 생성
      const ChatRooms = db.createObjectStore("chatRooms", {
        // ID를 기본 키로 사용
        keyPath: "id",
      });

      // "id"와 "name" 필드를 기준으로 인덱스 생성
      ChatRooms.createIndex("id", "id", { unique: true });
    };

    request.onsuccess = (e: Event) =>
      resolve((e.target as IDBOpenDBRequest).result); // 데이터베이스 열기 성공 시 해결(resolve)
    request.onerror = (e: Event) =>
      reject((e.target as IDBOpenDBRequest).error); // 데이터베이스 열기 실패 시 거부(reject)
  });
}

async function createChatRoom(room: Omit<ChatRoom, "id">) {
  // 데이터 베이스 열기
  const db = await openDB();

  // "chatRooms" 객체 저장소에 대한 쓰기 트랜잭션 시작
  const transaction = db.transaction("chatRooms", "readwrite");

  // // "chatRooms" 객체 저장소 가져오기
  const store = transaction.objectStore("chatRooms");

  // 채팅방 객체(room)를 저장소에 추가하는 요청
  const request = store.add({ ...room });

  // 채팅방 추가 성공 시 결과값 반환
  return new Promise((resolve, reject) => {
    request.onsuccess = (e: Event) => {
      resolve((e.target as IDBRequest).result);
    };

    // 채팅방 추가 실패 시 에러 반환
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
  // 데이터베이스 열기
  const db = await openDB();

  // "chatRooms" 객체 저장소에 대한 쓰기 트랜잭션 시작
  const transaction = db.transaction("chatRooms", "readwrite");

  // "chatRooms" 객체 저장소 가져오기
  const store = transaction.objectStore("chatRooms");

  // 주어진 room 객체를 저장소에 업데이트하는 요청
  const request = store.put(room);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      // 업데이트 성공 시 결과값 없이 해결(resolve)
      resolve(null);
    };
    request.onerror = () => {
      // 업데이트 실패 시 에러 없이 거부(reject)
      reject(null);
    };
  });
}

async function getOrCreateChatRoomById(id: number): Promise<unknown> {
  // 데이터베이스 열기
  const db = await openDB();

  // "chatRooms" 객체 저장소에 대한 쓰기 트랜잭션 시작
  const transaction = db.transaction("chatRooms", "readwrite");

  // "chatRooms" 객체 저장소 가져오기
  const store = transaction.objectStore("chatRooms");

  // 주어진 id에 해당하는 채팅방 가져오기
  const request = store.get(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = (e: Event) => {
      // 요청 결과 가져오기
      const result = (e.target as IDBRequest).result;
      if (result) {
        if (!result.messages) {
          // 가져온 채팅방에 메시지 배열이 없으면 빈 배열로 초기화
          result.messages = [];
        }

        // 가져온 채팅방 객체를 해결(resolve)
        resolve(result);
      } else {
        const newRoom: ChatRoom = {
          name: "My New Room",
          maxMembers: 100,
          createdAt: new Date(),
          messages: [], // 새로운 채팅방 객체 생성
        };
        const addRequest = store.add(newRoom); // 새로운 채팅방을 저장소에 추가하는 요청
        addRequest.onsuccess = () => {
          resolve(newRoom); // 새로운 채팅방 객체를 해결(resolve)
        };
        addRequest.onerror = e => {
          reject((e.target as IDBRequest).error); // 저장소 추가 요청 실패 시 에러를 거부(reject)
        };
      }
    };

    request.onerror = e => {
      reject((e.target as IDBRequest).error); // 채팅방 가져오기 요청 실패 시 에러를 거부(reject)
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
