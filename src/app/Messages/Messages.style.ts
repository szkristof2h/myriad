import styled from "styled-components";
import theme from "../theme";
import { Box } from "../components/Box.style";

const StyledMessages = styled(Box)`
  display: grid;
  grid-row-gap: ${theme.base.gutter / 2}px;
  margin-top: ${theme.base.gutter / 2}px;
  font-size: 1rem;
  .message {
    display: grid;
    grid-template-columns: 1fr 100px auto;
    align-content: center;
    overflow: hidden;
    grid-column-gap: ${theme.base.gutter / 2}px;
    padding: ${theme.base.gutter / 2}px;
    &:nth-child(even) {
      background: ${theme.color.zebraRow};
    }
  }
  .text,
  .date,
  .user {
    padding: ${theme.base.gutter / 2}px;
    max-height: 1.8em;
    overflow: hidden;
    &:hover:not(.message__date) {
      text-decoration: underline;
    }
  }
`;

export default StyledMessages;
