import styled from "styled-components";
import theme from "../theme";

const Button = styled.div`
  padding: ${theme.base.gutter / 2}px;
  background-color: ${({ active }) => !active ? theme.color.brown : theme.color.brownLight};
  text-align: center;
  color: white;
  font-family: "Artifika";
  &:visited,
  &:active {
    color: white;
  }
  &:hover {
    background: ${theme.color.brownLight};
  }
`;

const ButtonError = styled(Button)`
  background: ${({ active }) =>
    !active ? theme.color.error : theme.color.errorActive};
  &:hover {
    background: ${theme.color.errorHover};
  }
`;

// TODO: change to image
const ButtonArrow = styled(Button)`
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  margin: 0;
  padding: 5px;
  width: 2em;
  height: 2em;
  &:hover {
    background: rgba(0, 0, 0, 0.6);
  }
`;

const ButtonOk = styled(Button)`
  background: ${({ active }) => !active ? theme.color.ok : theme.color.okActive};
  &:hover {
    background: ${theme.color.okHover};
  }
`;

const ButtonGoogle = styled(Button)`
  background: #dd4b39;
  color: white;
  &:hover {
    background: rgb(243, 84, 63);
  }
`;

const ButtonTransparent = styled(Button)`
  background: transparent;
  &:hover {
    background: transparent;
    text-decoration: underline;
  }
`;

const ButtonActive = styled(Button)`
  background: rgb(151, 149, 87);
`;

export {
  Button,
  ButtonError,
  ButtonOk,
  ButtonGoogle,
  ButtonTransparent,
  ButtonActive,
  ButtonArrow
};