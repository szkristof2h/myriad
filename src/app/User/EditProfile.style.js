import styled from "styled-components";
import theme from "../theme";
import { Box } from "../components/Box.style";

const StyledEditProfile = styled(Box)`
  display: grid;
  justify-content: center;
  justify-self: center;
  grid-row-gap: ${theme.base.gutter/2}px;
  word-break: break-all;
  margin-top: 3px;
  grid-template-rows: initial;
  > .avatar {
    justify-self: center;
    width: 200px;
    height: 200px;
    margin-bottom: ${theme.base.gutter}px;
  }
`;

export default StyledEditProfile;
