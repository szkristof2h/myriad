import styled from "styled-components"
import theme from "../../theme"
import { Header } from "../../Typography/Typography.style"
import { Props } from "./index"

interface ButtonProps extends Props {}

const Button = styled("div")((props: ButtonProps) => {
  const { active, rated, type } = props

  const primaryStyle = {
    padding: `${theme.base.gutter / 2}px`,
    backgroundColor: !active ? theme.color.brown : theme.color.brownLight,
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
    background: !active ? theme.color.error : theme.color.errorActive,
    ["&:hover"]: {
      background: theme.color.errorHover,
    },
  }

  // TODO: change to image
  const arrowStyle = {
    background: "rgba(0, 0, 0, 0.4)",
    borderRadius: "50%",
    margin: 0,
    padding: "5px",
    width: "2em",
    height: "2em",
    ["&:hover"]: {
      background: "rgba(0, 0, 0, 0.6)",
    },
  }

  const confirmStyle = {
    background: !active ? theme.color.ok : theme.color.okActive,
    ["&:hover"]: {
      background: theme.color.okHover,
    },
  }

  const googleStyle = {
    background: "#dd4b39",
    color: theme.color.white,
    ["&:hover"]: {
      background: "rgb(243, 84, 63)",
    },
  }

  const transparentStyle = {
    background: "transparent",
    color: theme.color.black,
    ["&:hover"]: {
      background: "transparent",
      textDecoration: "underline",
      color: theme.color.black,
    },
    ["&:active, &:visited"]: {
      color: theme.color.black,
    },
  }

  const activeStyle = {
    background: "rgb(151, 149, 87)",
  }

  const rateStyle = {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gridColumnGap: `${theme.base.gutter / 2}px`,
    alignSelf: "end",
    alignItems: "center",
    height: "26px",
    padding: "1px 2px",
    background: rated ? theme.color.rateActive : theme.color[type],
    ["&:hover"]: {
      background: rated ? theme.color.rateActiveHover : theme.color[type + "Hover"],
    },
    ["> .icon"]: {
      width: "20px",
    },
    [`${Header}`]: {
      padding: 0,
      fontFamily: theme.font.style.button,
    },
  }

  // merge with rateStyle?
  const rateBigStyle = {
    display: "grid",
    background: "none",
    gridTemplateColumns: "auto 1fr",
    gridColumnGap: `${theme.base.gutter / 2}px`,
    alignSelf: "end",
    alignItems: "center",
    height: "auto",
    padding: 0,
    ["> .icon"]: {
      width: "40px",
    },
    [`${Header}`]: {
      color: rated ? theme.color.black : theme.color.gray,
      padding: `0 ${theme.base.gutter / 2}px 0 0`,
    },
    ["&:hover"]: {
      background: "none",
      [`& > ${Header}`]: {
        color: !rated ? theme.color.black : theme.color.gray,
        textDecoration: "none !important",
      },
      ["& > .icon"]: {
        stroke: rated
          ? "gray"
          : type === "impressedBig"
          ? "yellow"
          : theme.color.black,
        fill: rated ? "none" : type === "impressedBig" ? "yellow" : "none",
      },
    },
  }

  const styles = {
    primary: primaryStyle,
    danger: { ...primaryStyle, dangerStyle },
    arrow: { ...primaryStyle, arrowStyle },
    confirm: { ...primaryStyle, confirmStyle },
    google: { ...primaryStyle, googleStyle },
    transparent: { ...primaryStyle, transparentStyle },
    active: { ...primaryStyle, activeStyle },
    impressed: { ...primaryStyle, rateStyle },
    meh: { ...primaryStyle, rateStyle },
    impressedBig: { ...primaryStyle, rateBigStyle },
    mehBig: { ...primaryStyle, rateBigStyle },
  }

  return styles[type]
})

export default Button
