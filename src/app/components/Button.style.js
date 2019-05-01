import styled from "styled-components";
import theme from "../theme";

const Button = styled.input`
  padding: ${theme.base.gutter / 2}px;
  background-color: ${theme.color.brown};
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
  background: ${theme.color.error};
  &:hover {
    background: ${theme.color.errorHover};
  }
`;

const ButtonOk = styled(Button)`
  background: ${theme.color.ok};
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

export { Button, ButtonError, ButtonOk, ButtonGoogle, ButtonTransparent };