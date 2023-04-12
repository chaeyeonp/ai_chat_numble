import OpenAI from 'openai';

// API 키를 받아서 OpenAI 인스턴스를 생성하는 함수
export function createOpenAIInstance(apiKey: string): typeof OpenAI {
    // OpenAI 객체를 확장하여 apiKey를 포함하도록 수정
    const openai = {...OpenAI, apiKey};

    // 수정된 OpenAI 객체 반환
    return openai;
}
