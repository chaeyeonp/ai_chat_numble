import React, { ChangeEvent, useState } from "react";
import {
  ButtonContainer,
  CenteredForm,
  StyledInput,
  Button,
  UnderlineTypography,
  TitleTypography,
  ErrorTypography,
} from "../../styles/LoginForm.styles";
import { useRouter } from "next/router";

export default function LoginForm() {
  // API 키와 에러 상태를 관리하는 상태 변수 선언
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // 폼 제출 처리 함수
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const currentOrigin = window.location.origin; // 현재 도메인 가져오기

    // API 키 검증을 위해 서버로 POST 요청 전송
    const _result = await fetch("/api/key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: currentOrigin, // 현재 도메인으로 설정
      },
      body: JSON.stringify({
        apiKey: apiKey,
      }),
    });

    // 서버 응답을 JSON 형식으로 파싱
    const _data = await _result.json();

    // 응답 결과에 따라 처리
    if (_data.result === "success") {
      setError(""); // 에러 초기화
      sessionStorage.setItem("apiKey", apiKey); // API 키를 세션 스토리지에 저장
      router.push("/chatlist"); // 채팅 목록 페이지로 이동
    } else {
      setError(_data.result); // 에러 메시지 설정
    }
  };

  // 입력값 변경 시 처리 함수
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value); // API 키 상태 업데이트
  };

  // API 키 발급받는 페이지로 이동
  const generateKey = () => {
    window.open("https://platform.openai.com/account/api-keys");
  };

  return (
    <CenteredForm>
      <img src={"images/chat_logo.png"} alt="Chat Logo" width={100} />
      <TitleTypography>API KEY</TitleTypography>

      {/* 입력 필드 */}
      <StyledInput
        type="text"
        value={apiKey}
        onChange={handleInputChange}
        name={"login_input"}
      />

      {/* 에러 메시지 */}
      <ErrorTypography>{error}</ErrorTypography>

      <ButtonContainer>
        {/* 로그인 버튼 */}
        <Button onClick={handleSubmit} id={"login_button"}>
          Login
        </Button>

        {/* 키 발급받는 방법 링크 */}
        <UnderlineTypography onClick={generateKey}>
          KEY 발급받는 방법
        </UnderlineTypography>
      </ButtonContainer>
    </CenteredForm>
  );
}
