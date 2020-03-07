import styled from "styled-components";
import theme from "../../theme";

const TextArea = styled.textarea`
  border: none;
  border-bottom: 1px solid black;
  margin-bottom: ${theme.base.gutter * 1.5}px;
  resize: vertical;
  &:focus {
    outline: none;
  }
`;

export default TextArea