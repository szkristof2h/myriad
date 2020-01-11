import styled from "styled-components";
import theme from "./theme";

const Posts = styled.div(({ width, height }) => ({
  display: 'grid',
  maxWidth: `${width - 66}px`,
  background: theme.color.gray,
  gridAutoColumns: `${(width - 66) / 40}px`,
  gridAutoRows: `${(height - 12) / 40}px`,
}))

export default Posts
