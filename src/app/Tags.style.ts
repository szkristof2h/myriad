import styled from "styled-components";
import theme from "./theme";

const StyledTags = styled.ul`
  display: grid;
  position: fixed;
  bottom: 0;
  width: 100%;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  grid-column-gap: ${theme.base.gutter / 2}px;
  justify-content: start;
  background: #111;
  margin-top: -1px;
  font-size: 1rem;
  padding: 0 ${theme.base.gutter / 2}px;
  .tag {
    font-size: 0.8em;
    padding-bottom: 1px;
    .tag__link {
      font-size: ${theme.font.header1};
      color: ${theme.color.white};
      &:visited,
      &:active {
        color: ${theme.color.white};
      }
      &:hover {
        text-decoration: underline;
      }
    }
  }
`


export { StyledTags };
