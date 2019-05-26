import styled from "styled-components";
import theme from "../theme";

const Base = styled.span`
  font-size: 1em
`;

const Header = styled.div`
  font-size: ${({ size }) => theme.font["header" + size]};
  text-align: ${({ centered }) => (centered ? "center" : "initial")};
  font-family: "Artifika";
  padding: ${theme.base.gutter}px;
`;


const Warning = styled(Header)`
  background: ${theme.color.warn}
`;

const Error = styled.div`
  text-align: ${({ centered }) => (centered ? "center" : "initial")};
  color: ${theme.color.error};
`;

export { Base, Header, Error, Warning };
