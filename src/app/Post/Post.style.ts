import styled from "styled-components"
import theme from "../theme"
import { Header, UserHeader, Base } from "../Typography/Typography.style"
import { Button } from "../components"
import StyledComments from "../Comments/Comments.style"

const NavigationButton = styled(Button)({
  position: "absolute",
  top: "50%",
  transform: "translate(0, -50%)",
})

const MainImage = styled.img({
  objectFit: "contain",
  minWidth: "1px",
  minHeight: "1px",
  justifySelf: "stretch",
  alignSelf: "stretch",
})

const MainVideo = styled.iframe({
  objectFit: "contain",
  minWidth: "1px",
  minHeight: "1px",
  justifySelf: "stretch",
  alignSelf: "stretch",
})

const ImageContainer = styled.div({
  display: "grid",
  position: "relative",
  gridColumn: 1,
  gridRow: "1 / span 5",
  maxWidth: "100%",
  maxHeight: "100%",
  justifyContent: "center",
  alignContent: "center",
  background: "black",
})

const Summary = styled(Base)({
  display: "initial",
  gridColumn: 2,
  gridRow: 3,
  textAlign: "justify",
  wordBreak: "break-word",
  borderBottom: `1px solid ${theme.color.divider}`,
  padding: `${theme.base.gutter / 2}px`,
  marginBottom: `${theme.base.gutter / 2}px`,
})

const ButtonContainer = styled.div({
  display: "grid",
  gridColumn: 2,
  gridRow: 5,
  gridColumnGap: `${theme.base.gutter / 2}px`,
  gridTemplateColumns: "auto auto 1fr auto auto",
  padding: `${theme.base.gutter / 2}px`,
  ".share-icon": {
    "&--facebook:hover": {
      fill: "#3b5998",
    },
    "&--twitter:hover": {
      fill: "#0084b4",
    },
  },
})

const Post = styled.div({
  display: "grid",
  background: "white",
  maxHeight: "calc(100% - 20px)",
  gridTemplateColumns: "1fr 400px",
  gridTemplateRows: "repeat(3, auto) 1fr auto",
  gridColumnGap: `${theme.base.gutter / 2}px`,
  margin: "10px 40px 25px 40px",
  padding: `0 ${theme.base.gutter}px 0 0`,
  textAlign: "center",
  overflow: "hidden",
  [`${Header}`]: {
    display: "initial",
    gridColumn: 2,
    gridRow: 1,
    paddingBottom: 0,
  },
  [`${UserHeader}`]: {
    gridColumn: 2,
    gridRow: 2,
    "&:hover": {
      textDecoration: "underline",
    },
    paddingBottom: `${theme.base.gutter}px`,
  },
  [`${StyledComments}`]: {
    gridColumn: 2,
    gridRow: 4,
  },
})

export {
  ButtonContainer,
  ImageContainer,
  MainImage,
  MainVideo,
  NavigationButton,
  Post,
  Summary,
}
