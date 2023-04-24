import React from "react";
import styled from "@emotion/styled";

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 90%;
  padding: 1rem;
`;

const Input = styled.input`
  flex-grow: 1;
  height: 2rem;
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #f5f5f5;
  font-size: 1rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #3a90f2;
  }
`;

const SendButton = styled.button`
  background-color: #3a90f2;
  color: #fff;
  padding:1rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  margin-left: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #3a90f2;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #3a90f2;
  }
`;

export function ChatInput(props: { onSendMessage: any }) {
  const [text, setText] = React.useState("");

  const handleTextChange = (event: any) => {
    setText(event.target.value);
  };

  const handleSendClick = () => {
    if (text.trim()) {
      props.onSendMessage(text);
      setText("");
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleSendClick();
    }
  };

  return (
    <InputContainer>
      <Input
        type="text"
        placeholder="메시지를 입력하세요..."
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
      />
      <SendButton onClick={handleSendClick}>보내기</SendButton>
    </InputContainer>
  );
}
