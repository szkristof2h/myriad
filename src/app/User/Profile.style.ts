import styled from "styled-components";
import theme from "../theme";
import { Box } from "../components/Box.style";

const StyledProfile = styled(Box)`
  display: grid;
  grid-template-rows: calc(${theme.font.header2} + ${theme.base.gutter}px) calc(
      147px - calc(${theme.font.header2} + ${theme.base.gutter}px)
    );
  justify-content: center;
  justify-self: center;
  grid-row-gap: ${theme.base.gutter / 2}px;
  word-break: break-all;
  margin-top: ${theme.base.gutter / 2}px;
  > .avatar {
    display: grid;
    grid-column: 1;
    grid-row: 1 / span 2;
    width: 150px;
    height: 150px;
    > .image {
      max-width: 100%;
      max-height: 100%;
      justify-self: center;
      align-self: center;
    }
  }
  > .title {
    grid-column: 2;
    min-width: 360px;
    max-width: 500px;
    overflow: hidden;
    padding: 0;
  }
  > .bio {
    grid-column: 2;
    max-width: 500px;
    overflow: hidden;
    text-align: justify;
    padding: ${theme.base.gutter / 2}px;
  }
  > .button {
    grid-column: 1 / span 2;
  }
`;

export default StyledProfile;
