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
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const _result = await fetch("/api/key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: apiKey,
      }),
    });

    const _data = await _result.json();

    if (_data.result === "success") {
      setError("");
      sessionStorage.setItem("apiKey", apiKey);
      router.push("/chatlist");
    } else {
      setError(_data.result);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const generateKey = () => {
    window.open("https://platform.openai.com/account/api-keys");
  };

  return (
    <CenteredForm>
      <img src={"images/chat_logo.png"} alt="Chat Logo" width={100} />
      <TitleTypography>API KEY</TitleTypography>
      <StyledInput type="text" value={apiKey} onChange={handleInputChange} />
      <ErrorTypography>{error}</ErrorTypography>

      <ButtonContainer>
        <Button onClick={handleSubmit}>Login</Button>
        <UnderlineTypography onClick={generateKey}>
          KEY 발급받는 방법
        </UnderlineTypography>
      </ButtonContainer>
    </CenteredForm>
  );
}
