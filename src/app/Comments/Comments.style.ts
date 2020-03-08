import styled from "styled-components";
import theme from "../theme";
import TextArea from "../components/TextArea/styles";
import Button from "../components/Button/styles";

const StyledComments = styled.div`
  display: grid;
  grid-auto-flow: row;
  align-content: start;
  overflow-y: auto;
  grid-template-columns: 1fr auto;
  grid-column-gap: ${theme.base.gutter / 2}px;
  > ${TextArea} {
    grid-column: 1 / span 2;
    margin-top: ${theme.base.gutter}px;
  }
  > ${Button} {
    grid-column: 1 / span 2;
    margin-top: ${theme.base.gutter / 2}px;
  }
`;

export default StyledComments;
