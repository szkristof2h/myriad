import styled from "styled-components"
import theme from "../theme"
import { Box } from "../components/Box.style"
import Button from "../components/Button/styles"
import { Header, Base } from "../Typography/Typography.style"

export const AvatarWrapper = styled.div({
  display: "grid",
  gridColumn: 1,
  gridRow: "1 / span 2",
  width: "150px",
  height: "150px",
  "> img": {
    maxWidth: "100%",
    height: "inherit",
    justifySelf: "start",
    alignSelf: "center",
  },
})

export const Profile = styled(Box)({
  display: "grid",
  gridTemplateRows: `calc(${theme.font.header2} + ${theme.base.gutter}px) calc(
      147px - calc(${theme.font.header2} + ${theme.base.gutter}px)
    )`,
  justifyContent: "center",
  justifySelf: "center",
  gridRowGap: `${theme.base.gutter / 2}px`,
  wordBreak: "break-all",
  marginTop: `${theme.base.gutter / 2}px`,
  [`${Header}`]: {
    gridColumn: 2,
    minWidth: "360px",
    maxWidth: "500px",
    overflow: "hidden",
    padding: 0,
  },
  [`${Base}`]: {
    gridColumn: 2,
    maxWidth: "500px",
    overflow: "hidden",
    textAlign: "justify",
    padding: `${theme.base.gutter / 2}px`,
  },
  [`${Button}`]: {
    gridColumn: "1 / span 2",
  },
})
