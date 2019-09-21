import styled from "styled-components";
import theme from "./theme";
import { TextArea } from "./components/Input.style";
import {
  Button,
  ButtonError,
  ButtonTransparent
} from "./components/Button.style";
import { Box } from "./components/Box.style";
import { Header } from "./Typography/Typography.style";

const StyledBrowse = styled(Box)`
  display: grid;
  grid-auto-flow: row;
  width: 100%;
  align-content: start;
  overflow-y: auto;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: ${theme.base.gutter}px;
  > .channel {
    background: ${theme.color.ok};
    padding: ${theme.base.gutter}px;
    text-align: center;
    &:hover {
      background: ${theme.color.okHover};
    }
  }
  > .button {
    grid-column: 1 / span 4 !important;
  }
  > ${Header} {
    grid-column: 1 / span 4;
  }
  > ${Button}, ${ButtonError}, ${ButtonTransparent} {
    grid-column: 1 / span 2;
    margin-top: ${theme.base.gutter / 2}px;
  }
`;

export default StyledBrowse;
