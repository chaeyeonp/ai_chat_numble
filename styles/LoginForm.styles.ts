import styled from "@emotion/styled";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  position: absolute;
  bottom: 0;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 50px;
  border: none;
  border-radius: 5px;
  background: #26d9fd;
  color: #000000;
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 10px;

  &:hover {
    background-color: #1e90ff;
    opacity: 0.8;
  }
`;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #000000;
  margin: 0;
`;

const CenteredForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  height: 90vh;
  background-color: #000000;
  margin: 0;

  h1 {
    font-size: 1.1rem;
    text-align: left;
    width: 100%;
  }
`;

const StyledInput = styled.input`
  width: 300px;
  border: 1px solid #ccc;
  padding: 0.5rem;

  &:focus {
    border-color: blue;
  }
`;

const TitleTypography = styled.h1`
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
`;

const ErrorTypography = styled.h1`
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ff0000;
`;

const UnderlineTypography = styled.span`
  position: relative;
  display: inline-block;
  margin: 2rem;
  color: #ffffff;
  cursor: pointer;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #ffffff;
  }
`;

export {
  ButtonContainer,
  Button,
  CenteredContainer,
  CenteredForm,
  StyledInput,
  TitleTypography,
  ErrorTypography,
  UnderlineTypography,
};
