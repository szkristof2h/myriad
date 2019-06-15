import styled from "styled-components";
import theme from "../theme";
import { Box } from "../components/Box.style";
import { Button } from "../components/Button.style";
import { Header, Error } from "../Typography/Typography.style";

const StyledNotifications = styled(Box)`
  display: grid;
  justify-self: center;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: ${theme.base.gutter / 2}px;
  grid-row-gap: ${theme.base.gutter / 2}px;
  margin-bottom: ${theme.base.gutter / 2}px;
  font-size: 1rem;
  width: 100%;
  > ${Header} {
    grid-column: 1 / span 3;
    margin-bottom: ${theme.base.gutter}px;
  }
  > ${Button}, ${Error} {
    grid-column: 1 / span 3;
    margin-top: ${theme.base.gutter}px;
  }
  .post {
    grid-column: auto;
    grid-row: auto;
    height: 120px;
  }
`;

export default StyledNotifications;
