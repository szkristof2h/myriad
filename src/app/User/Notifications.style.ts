import styled from "styled-components"
import theme from "../theme"
import { Box } from "../components/Box.style"
import Button from "../components/Button/styles"
import { Header, Error, UserHeader } from "../Typography/Typography.style"
import {
  StyledPost,
  StyledDetailsContainer,
  StyledHeaderContainer,
} from "../Post/Post.style"

const StyledNotifications = styled(Box)({
  display: "grid",
  justifySelf: "center",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridColumnGap: `${theme.base.gutter / 2}px`,
  gridRowGap: `${theme.base.gutter / 2}px`,
  marginBottom: `${theme.base.gutter / 2}px`,
  fontSize: "1rem",
  width: "100%",
  [`> ${Header}`]: {
    gridColumn: "1 / span 3",
    marginBottom: `${theme.base.gutter}px`,
  },
  [`> ${Button}, ${Error}`]: {
    gridColumn: "1 / span 3",
    marginTop: `${theme.base.gutter}px`,
  },
  [`${StyledPost}`]: {
    gridColumn: "auto",
    gridRow: "auto",
    height: "120px",
    [`${StyledDetailsContainer}`]: {
      gridTemplateColumns: "1fr",
      [`${StyledHeaderContainer}`]: {
        gridTemplateColumns: "1fr",
        [`${UserHeader}`]: {
          gridRow: 2,
        },
      },
    },
  },
})

export default StyledNotifications
