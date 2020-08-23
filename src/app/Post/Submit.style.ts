import styled from "styled-components"
import theme from "../theme"
import { Header, Error } from "../Typography/Typography.style"
import SubmitButton from "../components/Button/Submit/styles"
import Input from "../components/Input/styles"

export const TagList = styled.div({
  gridColumn: "span 3",
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

export const ImageContainer = styled.div.withConfig({
  shouldForwardProp: prop => !["isActive"].includes(prop),
})(({ isActive }) => ({
  maxWidth: "100%",
  height: "fit-content",
  border: isActive ? "3px solid black" : "",
  img: {
    display: "block",
    maxWidth: "inherit",
  },
}))

export const Submit = styled.div({
  fontSize: "1rem",
  form: {
    display: "grid",
    gridColumnGap: `${theme.base.gutter / 2}px`,
    gridTemplateColumns: "repeat(3, 1fr)",
    [`${SubmitButton}`]: {
      gridColumn: "span 3",
      width: "100%",
      li: {
        textAlign: "center",
        fontFamily: "Artifika",
      },
    },
  },
  [`${Header}, ${Error}, ${Input}`]: {
    gridColumn: "span 3",
  },
})
