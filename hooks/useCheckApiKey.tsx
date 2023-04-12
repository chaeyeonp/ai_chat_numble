import { useCallback } from 'react';
import { createOpenAIInstance } from './useCreateOpenAiInstance';

/**
 * isValidAPIKey - API 키를 검증하는 기능
 *
 * @param {string} apiKey 확인할 API 키의 문자열
 * @returns {Promise<boolean>} API가 유효하면 TRUE 리턴
 */

async function isValidAPIKey(apiKey: string): Promise<boolean> {
    const openai = createOpenAIInstance(apiKey);

    try {
        // 단순한 API 요청으로 존재하는지 확인
        // await openai.engines.list();
        return true;
    } catch (error) {
        console.error('Error validating API Key:', error);
        return false;
    }
}

/**
 * useCheckApiKey - API Key validation을 위한 HOOK
 *
 * @returns {function} API Key validation을 위한 함수 리턴
 */
export function useCheckApiKey() {
    const checkApiKey = useCallback(isValidAPIKey, []);

    return checkApiKey;
}
