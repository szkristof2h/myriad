import styled from "styled-components"
import theme from "../theme"
import { Box } from "../components/Box.style"
import { Base } from "../Typography/Typography.style"

export const MessageContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "1fr 100px auto",
  alignContent: "center",
  overflow: "hidden",
  gridColumnGap: `${theme.base.gutter / 2}px`,
  padding: `${theme.base.gutter / 2}px`,
  "&:nth-child(even)": {
    background: theme.color.zebraRow,
  },
})

const StyledConversations = styled(Box)({
  display: "grid",
  gridRowGap: `${theme.base.gutter / 2}px`,
  marginTop: `${theme.base.gutter / 2}px`,
  fontSize: "1rem",
  [`${Base}`]: {
    padding: `${theme.base.gutter / 2}px`,
    maxHeight: "1.8em",
    overflow: "hidden",
    "&:hover:not(:last-child)": {
      textDecoration: "underline",
    },
  },
})

export default StyledConversations
