import styled from "styled-components";
import theme from "./theme";
import { Base } from "./Typography/Typography.style";

const Navigation = styled.nav`
  display: grid;
  position: fixed;
  top: 10px;
  right: 10px;
  grid-auto-flow: column;
  grid-template-rows: repeat(7, ${theme.base.gutter * 3}px);
  grid-row-gap: ${theme.base.gutter / 2}px;
  z-index: 100;
  > .button {
    display: grid;
    justify-content: center;
    align-content: center;
    align-items: center;
    &:hover {
      width: auto;
      grid-auto-flow: column;
      > ${Base} {
        text-align: right;
        text-shadow: -2px -2px 1px black;
        color: rgba(254, 255, 0);
        display: block;
        grid-column: 1;
        margin-left: -${theme.base.gutter * 10}px;
        margin-right: ${theme.base.gutter / 2}px;
        padding: 0 ${theme.base.gutter / 2}px;
      }
    }
    > ${Base} {
      display: none;
      grid-column: 1;
      font-family: 'Sofia';
    }
    > .icon {
      grid-column: 2;
      background-color: rgba(254, 255, 0);
      border-radius: 50%;
      padding: ${theme.base.gutter / 4}px;
    }
  }
`

export default Navigation
