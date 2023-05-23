import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

// 응답 형식 정의
type ResponseType = {
  result?: string;
  error?: {
    message: string;
  };
};

// validateKey 함수 정의
export default async function validateKey(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  // 클라이언트로부터 받은 API 키
  const key = req.body.apiKey;

  try {
    // OpenAI API를 사용하기 위해 Configuration과 OpenAIApi 객체 생성
    const openai = new OpenAIApi(
      new Configuration({
        apiKey: key,
      }),
    );

    // OpenAI API를 사용하여 모델 목록을 가져옴
    openai
      .listModels()
      .then(() => {
        // 성공적으로 모델 목록을 가져왔을 때, "success" 결과를 응답으로 반환
        res.status(200).json({
          result: "success",
        });
      })
      .catch(e => {
        // 모델 목록을 가져오지 못했을 때, "fail" 오류 메시지를 응답으로 반환
        res.status(200).json({
          error: {
            message: "fail",
          },
        });
      });
  } catch (e) {
    // API 키 유효성 검사 중 에러가 발생했을 때, "Failed validating key" 오류 메시지를 응답으로 반환
    res.status(200).json({
      error: {
        message: "Failed validating key",
      },
    });
  }
}
