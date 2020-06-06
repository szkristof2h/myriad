import styled from "styled-components"
import theme from "../theme"
import { Header, UserHeader, Base } from "../Typography/Typography.style"
import { Button } from "../components"
import StyledComments from "../Comments/Comments.style"

const StyledDetailsContainer = styled.div({
  display: "none",
  gridRow: 2,
  "&:hover": {
    cursor: "default",
  },
})

const StyledHeaderContainer = styled.div({
  display: "grid",
  gridColumn: "1 / span 2",
  justifyItems: "center",
  alignItems: "center",
  background: "rgba(0, 0, 0, 0.4)",
  [`${Header}, & > .user`]: {
    overflow: "hidden",
    maxWidth: "100%",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  [`${Header}`]: {
    gridRow: 1,
    padding: `0 ${theme.base.gutter / 4}px`,
    "&:hover": {
      cursor: "pointer",
    },
  },
  "> .user": {
    gridRow: 2,
  },
})

const StyledPost = styled.div`
  border: 1px solid black;
  display: grid;
  grid-template-rows: 4fr 1fr;
  font-size: 1rem;
  color: white;
  &:hover {
    cursor: pointer;
    ${StyledDetailsContainer} {
      display: grid;
      gridtemplatecolumns: 1fr 1fr;
    }
  }
`

const StyledNavigationButton = styled(Button)({
  position: "absolute",
  top: "50%",
  transform: "translate(0, -50%)",
})

const StyledMainImage = styled.img({
  objectFit: "contain",
  minWidth: "1px",
  minHeight: "1px",
  justifySelf: "stretch",
  alignSelf: "stretch",
})

const StyledMainVideo = styled.iframe({
  objectFit: "contain",
  minWidth: "1px",
  minHeight: "1px",
  justifySelf: "stretch",
  alignSelf: "stretch",
})

const StyledImageContainer = styled.div({
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

const StyledSummary = styled(Base)({
  display: "initial",
  gridColumn: 2,
  gridRow: 3,
  textAlign: "justify",
  wordBreak: "break-word",
  borderBottom: `1px solid ${theme.color.divider}`,
  padding: `${theme.base.gutter / 2}px`,
  marginBottom: `${theme.base.gutter / 2}px`,
})

const StyledButtonContainer = styled.div({
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

const StyledPostOpen = styled.div({
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
  StyledButtonContainer,
  StyledDetailsContainer,
  StyledHeaderContainer,
  StyledImageContainer,
  StyledMainImage,
  StyledMainVideo,
  StyledNavigationButton,
  StyledPost,
  StyledPostOpen,
  StyledSummary,
}
