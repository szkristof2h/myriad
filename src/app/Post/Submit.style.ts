import styled from "styled-components"
import theme from "../theme"
import { Header, Error } from "../Typography/Typography.style"
import { Button } from "../components"

const TagList = styled.div({
  display: "flex",
  flexWrap: "wrap",
  margin: `-${theme.base.gutter / 2}px -${theme.base.gutter / 2}px
      ${theme.base.gutter / 2}px -${theme.base.gutter / 2}px`,
  li: {
    display: "inline-block",
    background: `${theme.color.zebraRow}`,
    padding: `${theme.base.gutter / 2}px`,
    margin: `${theme.base.gutter / 2}px`,
    cursor: "pointer",
    "&:hover": {
      background: `${theme.color.error}`,
    },
  },
})

const ImageContainer = styled.div(({ isActive }) => ({
  maxWidth: "100%",
  height: "fit-content",
  border: isActive ? "3px solid black" : "",
  img: {
    display: "block",
    maxWidth: "inherit",
  },
}))

const StyledSubmit = styled.div({
  display: "grid",
  fontSize: "1rem",
  gridColumnGap: `${theme.base.gutter / 2}px`,
  gridTemplateColumns: "repeat(3, 1fr)",
  [`${Header},${Error}`]: {
    gridColumn: "span 3",
  },
  [`${Button}`]: {
    gridColumn: "span 3",
    width: "100%",
    li: {
      textAlign: "center",
      fontFamily: "Artifika",
    },
  },
})

export { ImageContainer, StyledSubmit, TagList }
