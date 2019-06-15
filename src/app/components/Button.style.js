import styled from "styled-components";
import theme from "../theme";
import { Header } from "../Typography/Typography.style"

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
  color: black;
  &:hover {
    background: transparent;
    text-decoration: underline;
    color: black;
  }
  &:active, &:visited {
    color: black;
  }
`;

const ButtonActive = styled(Button)`
  background: rgb(151, 149, 87);
`;

const ButtonRate = styled(Button)`
  display: grid;
  grid-template-columns: 24px 1fr;
  grid-column-gap: ${theme.base.gutter / 2}px;
  align-self: end;
  align-items: center;
  height: 26px;
  padding: 1px 2px;
  background: ${({ type }) => theme.color[type]};
  &:hover {
    background: ${({ type }) => theme.color[type + "Hover"]};
  }
  > .icon {
    width: 20px;
  }
  ${Header} {
    padding: 0;
    font-family: "Artifika";
  }
`;

const ButtonRateBig = styled(Button)`
  display: grid;
  background: none;
  grid-template-columns: auto 1fr;
  grid-column-gap: ${theme.base.gutter / 2}px;
  align-self: end;
  align-items: center;
  height: auto;
  padding: 0;
  > .icon {
    width: 40px;
  }
  ${Header} {
    color: ${({ rated }) => (rated ? "black" : "gray")};
    padding: 0 ${theme.base.gutter/2}px 0 0;
  }
  &:hover {
    background: none;
    & > ${Header} {
      color: ${({ rated }) => (!rated ? "black" : "gray")};
    }
    & > .icon {
      stroke: ${({ rated, type }) =>
        rated ? "gray" : type === "impressed" ? "yellow" : "black"}
      fill: ${({ rated, type }) =>
        rated ? "none" : type === "impressed" ? "yellow" : "none"}
    }
  }
`;

export {
  Button,
  ButtonError,
  ButtonOk,
  ButtonGoogle,
  ButtonRate,
  ButtonRateBig,
  ButtonTransparent,
  ButtonActive,
  ButtonArrow
};