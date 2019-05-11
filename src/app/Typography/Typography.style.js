import styled from "styled-components";
import theme from "../theme";

const Header = styled.div`
  font-size: ${({ size }) => theme.font["header" + size]};
  text-align: ${({ centered }) => (centered ? "center" : "initial")};
  font-family: "Artifika";
  padding: ${theme.base.gutter}px 0;
`;

const Warning = styled.div`
  font-size: ${({ size }) => theme.font["header" + size]};
  text-align: ${({ centered }) => (centered ? "center" : "initial")};
  font-family: "Artifika";
  padding: ${theme.base.gutter}px 0;
  background: ${theme.color.warn}
`;

const Error = styled.div`
  text-align: ${({ centered }) => (centered ? "center" : "initial")};
  color: ${theme.color.error};
`;

export { Header, Error, Warning };
