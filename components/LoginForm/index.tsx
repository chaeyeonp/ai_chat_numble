// LoginForm.js
import React, {ChangeEvent, useState} from "react";
import {
    ButtonContainer,
    CenteredForm,
    StyledInput,
    Button,
    UnderlineTypography,
    TitleTypography,
} from "./LoginForm.styles";
import {useRouter} from "next/router";


export default function LoginForm() {
    const [apiKey, setApiKey] = useState("");
    const router = useRouter();

    const handleSubmit = async (event: any) => {
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
            console.log("success");
            sessionStorage.setItem("apiKey", apiKey);
            // handleFetchApi();
            router.push("/lobby");
        } else {
            console.log("fail");
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setApiKey(event.target.value);
    };

    const generateKey = () => {
        window.open("https://platform.openai.com/account/api-keys");
    };

    return (
        <CenteredForm onSubmit={handleSubmit}>
            <img src={"chat_logo.png"} alt="Chat Logo" width={100}/>
            <TitleTypography>API KEY</TitleTypography>
            <StyledInput type="text" value={apiKey} onChange={handleInputChange}/>
            <ButtonContainer>
                <Button type="submit">Login</Button>
                <UnderlineTypography onClick={generateKey}>
                    KEY 발급받는 방법
                </UnderlineTypography>
            </ButtonContainer>
        </CenteredForm>
    );
}
