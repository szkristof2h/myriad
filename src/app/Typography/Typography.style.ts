import styled from "styled-components";
import theme from "../theme";

const Base = styled.span`
  font-size: 1em;
  word-break: break-all
`;

// NOTE: if you're using Header as a Link and want it to be centered use it like this:
// centered={1}
// otherwiser you'll get an error.
// More info here: https://github.com/styled-components/styled-components/issues/1198
const Header = styled.div`
  font-size: ${({ size }) => theme.font["header" + size]};
  text-align: ${({ centered=false }) => (centered ? "center" : "initial")};
  font-family: "Artifika";
  padding: ${theme.base.gutter}px;
`;

const UserHeader = styled(Header)`
  font-family: "Sofia";
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: ${({ centered = false }) => (centered ? "center" : "initial")};
`;


const Warning = styled(Header)`
  text-align: ${({ centered }) => (centered ? "center" : "initial")};
  background: ${theme.color.warn};
`;

const Error = styled.div`
  text-align: ${({ centered }) => (centered ? "center" : "initial")};
  color: ${theme.color.error};
`;

export { Base, Header, Error, Warning, UserHeader };
