// styles/ChatListStyles.tsx
import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #000;
  color: #fff;
  height: 60px;
  z-index: 1;
`;

export const Content = styled.div`
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  top: 120px;
  bottom: 120px;
  overflow-y: auto;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const Footer = styled.div`
  background-color: #000;
  color: #fff;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 0;
`;

export const Logo = styled.img`
  height: 40px;
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  //&:hover {
  //  background-color: #0059d6;
  //}
`;
export const ModifyButton = styled.button`
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  background-color: #26d9fd;
  color: #000000;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  //&:hover {
  //  background-color: #0059d6;
  //}
`;

export const CreateRoomButton = styled.button`
  width: 90%;
  padding: 0.5rem 0;
  font-size: 1rem;
  background-color: #60a9e6;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  align-items: center;
  &:hover {
    background-color: #4792cc;
  }
`;
export const CustomTable = styled.table`
  width: 95%;
  border-collapse: collapse;
  table-layout: fixed;
  color: white;
  border: 1px solid white;
  & th,
  & td {
    border-top: 1px solid white;
    padding: 0.5rem;
    text-align: left;
  }
  & th {
    background-color: rgba(255, 255, 255, 0.2);
  }
  & th:first-of-type,
  & td:first-of-type {
    width: 80%;
  }
  & th:last-of-type,
  & td:last-of-type {
    width: 20%;
  }
`;

export const Table = styled.table`
  width: 100%;
  text-align: left;
  color: white;
  border-collapse: collapse;
  border: 1px solid white;
`;

export const TableHeader = styled.th`
  border-bottom: 1px solid white;
  padding: 8px;
  width: 50%;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Input = styled.input`
  display: block;
  width: 80vw;
  padding: 8px 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

export const StyledDialogTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
`;
