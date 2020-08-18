import styled from "styled-components"
import theme from "../../../theme"
import { Props } from "./index"

interface ButtonProps extends Props {}

const Button = styled("button").withConfig({
  shouldForwardProp: prop =>
    !["buttonType", "isActive", "isLoading", "isDisabled"].includes(prop),
})((props: ButtonProps) => {
  const { isActive, isLoading, buttonType } = props

  const primaryStyle = {
    padding: `${theme.base.gutter / 2}px`,
    backgroundColor: !isActive ? theme.color.brown : theme.color.brownLight,
    textAlign: "center",
    color: theme.color.white,
    fontFamily: theme.font.style.button,
    ["&:visited, &:active"]: {
      color: theme.color.white,
    },
    ["&:hover"]: {
      background: theme.color.brownLight,
    },
  }

  const dangerStyle = {
    background: !isActive ? theme.color.error : theme.color.errorActive,
    ["&:hover"]: {
      background: theme.color.errorHover,
    },
  }

  const confirmStyle = {
    background: !isActive ? theme.color.ok : theme.color.okActive,
    ["&:hover"]: {
      background: theme.color.okHover,
    },
  }

  const loadingStyle = {
    background: "gray",
  }

  const styles = {
    confirm: { ...primaryStyle, ...confirmStyle },
    danger: { ...primaryStyle, ...dangerStyle },
    primary: primaryStyle,
  }

  return {
    cursor: "pointer",
    border: 0,
    ":focus": {
      outline: 0,
    },
    ...styles[buttonType],
    ...(isLoading ? loadingStyle : {}),
  }
})

export default Button
