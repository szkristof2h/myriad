import styled from "styled-components";
import theme from "./theme";
import { Base } from "./Typography/Typography.style";
import { Box } from "./components/Box.style";

const StyledError = styled(Box)`
  display: grid;
  justify-content: center;
  grid-row-gap: ${theme.base.gutter / 2}px;
  margin-top: ${theme.base.gutter / 2}px;
  background: ${theme.color.error};
  max-height: fit-content;
  overflow-y: auto;
  z-index: 200;
  text-align: justify;
  > ${Base} {
    word-break: break-word;
  }
`;

export default StyledError;
