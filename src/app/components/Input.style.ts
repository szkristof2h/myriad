import styled from "styled-components";
import theme from "../theme";

const Input = styled.input`
  border: none;
  border-bottom: 1px solid black;
  margin-bottom: ${theme.base.gutter*1.5}px;
  &:focus {
    outline: none;
  }
`;

const TextArea = styled.textarea`
  border: none;
  border-bottom: 1px solid black;
  margin-bottom: ${theme.base.gutter * 1.5}px;
  resize: vertical;
  &:focus {
    outline: none;
  }
`;

export { Input, TextArea }