// OpenAI_API.ts
// OpenAI_API는 OpenAI API를 호출하여 AI 응답을 생성하는 함수입니다.

import {addMessage} from "../../../database/Data";

const API_URL = "https://api.openai.com/v1/chat/completions";

export async function OpenAI_API(prompt: any, roomId: number, maxMembers: number) {
    // 후보 프로필 이미지와 닉네임 배열
    let profileImages = ['profile_1.png', 'profile_2.png', 'profile_3.png', 'profile_4.png'];
    let nicknames = ['User1', 'User2', 'User3', 'User4'];

    // 랜덤 인덱스 생성
    const randomImageIndex = Math.floor(Math.random() * profileImages.length);
    const randomNicknameIndex = Math.floor(Math.random() * nicknames.length);

    // OpenAI API를 호출하기 위한 fetch 요청을 준비합니다.
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // API key를 Authorization 헤더에 포함시킵니다.
            Authorization: `Bearer ${sessionStorage.getItem("apiKey")}`,
        },
        body: JSON.stringify({
            max_tokens: 150,
            // maxMembers - 1 만큼의 응답을 생성하도록 설정합니다.
            // 이렇게 하면, 채팅방의 모든 멤버에 대해 서로 다른 응답을 얻을 수 있습니다.
            n: maxMembers - 1,
            stop: null,
            temperature: 1,
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
        }),
    });

    // 응답이 성공적으로 수신되면, 응답을 처리합니다.
    if (response.ok) {
        // 응답을 JSON으로 변환합니다.
        const data = await response.json();

        console.log("data", data);

        // 디버그 정보를 콘솔에 출력합니다.

        // AI의 응답들을 추출하고 각각에 대해 addMessage를 호출합니다.

        for (let index of data.choices.keys()) {
            const aiResponse = data.choices[index].message.content;

            await addMessage(roomId, {
                content: aiResponse,
                sender: "ai",
                image: profileImages[randomImageIndex],
                name: nicknames[randomNicknameIndex],
                timestamp: new Date(),
            }).then(messageId => {
                console.log(messageId);
            }).catch(error => {
                console.log(error);
            });
        }


        // for (let index of data.choices.keys()) {
        //     const aiResponse = data.choices[index].message.content;
        //
        //     // AI의 응답을 채팅 메시지로 데이터베이스에 추가합니다.
        //     await addMessage(roomId, {
        //         content: aiResponse,
        //         sender: "ai",
        //         // image: `profile_${index + 1}.png`, // 랜덤 프로필 이미지
        //         image: selectedProfileImage,
        //         // name: `User${Math.floor(Math.random() * 4) + 1}`, // 랜덤 사용자 이름
        //         name: selectedNickname,
        //         timestamp: new Date(), // 현재 시간
        //     }).then(messageId => {
        //         // 메시지가 성공적으로 저장되었다면, 메시지 ID를 콘솔에 출력합니다.
        //         console.log(`Message saved with ID: ${messageId}, AI Response: ${aiResponse}`);
        //     }).catch(error => {
        //         // 메시지 저장에 실패한 경우, 에러를 콘솔에 출력합니다.
        //         console.error(`Failed to save message: ${error}`);
        //     });
        // }

    } else {
        // 응답이 실패하면, 에러를 발생시킵니다.
        throw new Error("API request failed");
    }
}
