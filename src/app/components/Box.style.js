import styled from "styled-components";
import theme from "../theme";

const Box = styled.div`
  justify-self: center;
  padding: ${theme.base.gutter}px;
  border-radius: ${theme.base.borderRadius}px;
  margin: ${theme.base.gutter}px 0;
  font-size: 1rem;
  max-width: 550px;
  min-width: ${({ type }) =>
    !type ? "100px" : type === "login" ? "300px" : "initial"};
  background: ${({ type }) =>
    !type ? "white" : type === "warn" ? theme.color.highRed : "blue"};
  color: ${({ type }) =>
    !type ? "black" : type === "warn" ? "white" : "blue"};
`;

export { Box }