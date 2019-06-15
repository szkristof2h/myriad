import styled from "styled-components";
import theme from "../theme";

const StyledComment = styled.div`
  grid-column: 1 / span 2;
  text-align: left;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  > .user {
    font-weight: bold;
  }
  > .date {
    font-style: italic;
    color: gray;
    font-size: ${theme.font.size};
  }
`;

export default StyledComment;
