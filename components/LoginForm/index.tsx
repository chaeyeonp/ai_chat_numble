import React, {useState, ChangeEvent, FormEvent} from 'react';
import {
    ButtonContainer,
    CenteredForm,
    StyledInput,
    Button,
    UnderlineTypography,
    TitleTypography
} from "./LoginForm.styles";

export default function LoginForm() {

    const [apiKey, setApiKey] = useState('');
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // API Key를 로컬 스토리지에 저장
        localStorage.setItem('openai_api_key', apiKey);

        // API Key 유효성 검사 및 로그인 페이지로 이동
        // TODO: API Key 유효성 검사 후 결과에 따라 처리
        window.location.href = '/LoginForm';
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setApiKey(event.target.value);
    };

    return (
        <CenteredForm onSubmit={handleSubmit}>
            <img src={"chat_logo.png"} alt="Chat Logo" width={100}/>
            <TitleTypography>API KEY</TitleTypography>
            <StyledInput
                type="text"
                value={apiKey}
                onChange={handleInputChange}
            />
            <ButtonContainer>
                <Button type="submit">Login</Button>
                <UnderlineTypography>KEY 발급받는 방법</UnderlineTypography>
            </ButtonContainer>
        </CenteredForm>
    );
}
