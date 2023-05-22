// OpenAI API를 호출하여 AI 응답을 생성하는 함수

import { addMessage } from "../../../database/Data";

const API_URL = "https://api.openai.com/v1/chat/completions";

export async function OpenAI_API(
  prompt: any,
  roomId: number,
  maxMembers: number,
) {
  // 후보 프로필 이미지와 닉네임 배열
  const profileImages = [
    "profile_1.png",
    "profile_2.png",
    "profile_3.png",
    "profile_4.png",
  ];
  const nicknames = ["User1", "User2", "User3", "User4"];

  // OpenAI API 호출 준비
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // API 키를 Authorization 헤더에 포함시킴
      Authorization: `Bearer ${sessionStorage.getItem("apiKey")}`,
    },
    body: JSON.stringify({
      max_tokens: 150,
      // maxMembers - 1 만큼의 응답 생성
      n: maxMembers - 1,
      stop: null,
      temperature: 1,
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  // 응답이 성공적으로 수신되면, 응답을 처리
  if (response.ok) {
    // 응답을 JSON 형식으로 변환합니다.
    const data = await response.json();

    // AI 응답을 추출하고 각 응답에 대해 addMessage를 호출

    for (let index = 0; index < data.choices.length; index++) {
      const choice = data.choices[index];
      const aiResponse = choice.message.content;

      // 응답 인덱스를 기반으로 프로필 이미지와 닉네임의 인덱스를 생성
      const randomImageIndex = (index + roomId) % profileImages.length;
      const randomNicknameIndex = (index + roomId) % nicknames.length;

      await addMessage(roomId, {
        content: aiResponse,
        sender: "ai",
        image: profileImages[randomImageIndex],
        name: nicknames[randomNicknameIndex],
        timestamp: new Date(),
      })
        .then(messageId => {
          console.log(messageId);
        })
        .catch(error => {
          console.log(error);
        });
    }
  } else {
    // 응답이 실패한 경우, 에러 발생
    throw new Error("API 요청 실패");
  }
}
