import {addMessage} from "../../../database/Data";

const API_URL = "https://api.openai.com/v1/chat/completions";

export async function OpenAI_API(prompt: any, roomId: number) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("apiKey")}`,
        },
        body: JSON.stringify({
            // prompt,
            max_tokens: 150,
            n: 1,
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

    if (response.ok) {
        const data = await response.json();

        console.log("DDD : ", data, data && data.choices.length > 0 && data.choices[0].text.trim())


        // 답변 내용 console에 띄우기
        //
        // console.log("D", data.choices[0].text.trim())

        addMessage(roomId, {
            content: data.choices[0].text.trim(),
            sender: "ai",
            // public/images 안에 있는 이미지를 렌덤으로 넣기
            image: `profile${Math.floor(Math.random() * 4) + 1}.png`,
            // 닉네임은 렌덤으로 넣기 (string type으로 넣기
            name: `User${Math.floor(Math.random() * 4) + 1}`,
            timestamp: new Date(),
        }).then(messageId => {
            console.log(`Message saved with ID: ${messageId}`);
        }).catch(error => {
            console.error(`Failed to save message: ${error}`);
        });
    } else {
        throw new Error("API request failed");
    }
}

export default OpenAI_API;
