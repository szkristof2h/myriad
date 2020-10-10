import { FC } from "react"
import styled from "styled-components"
import theme from "../theme"
import { Header } from "../Typography/Typography.style"
import Button from "../components/Button/styles"

interface Props {
  isActive: boolean
  size: "big" | "small"
  type: "impressed" | "meh"
}

const ButtonWrapper: FC<Props> = styled.div(({ isActive, size, type }) => {
  // TODO: organize these styles better
  const styles = {
    impressed: {
      ["svg"]: {
        width: "40px",
        height: "40px",
        stroke: isActive ? theme.color.yellow : theme.color.darkGray,
        fill: isActive ? theme.color.yellow : "none",
      },
      [`${Header}`]: {
        padding: `0 ${theme.base.gutter / 2}px 0 0`,
        alignSelf: "center",
        color: `${
          isActive ? theme.color.yellow : theme.color.darkGray
        } !important`,
      },
    },
    meh: {
      ["svg"]: {
        width: "40px",
        height: "40px",
        stroke: isActive ? theme.color.black : theme.color.darkGray,
        fill: "none",
      },
      [`${Header}`]: {
        padding: `0 ${theme.base.gutter / 2}px 0 0`,
        alignSelf: "center",
        color: `${
          isActive ? theme.color.black : theme.color.darkGray
        } !important`,
      },
    },
  }

  const hoverStyles = {
    impressed: {
      ["svg"]: {
        stroke: isActive ? theme.color.black : theme.color.yellow,
        fill: isActive ? "none" : theme.color.yellow,
      },
      [`${Header}`]: {
        color: `${
          isActive ? theme.color.black : theme.color.darkGray
        } !important`,
        padding: `0 ${theme.base.gutter / 2}px 0 0`,
      },
    },
    meh: {
      ["svg"]: {
        stroke: isActive ? theme.color.black : theme.color.red,
      },
      [`${Header}`]: {
        color: `${isActive ? theme.color.black : theme.color.red} !important`,
        padding: `0 ${theme.base.gutter / 2}px 0 0`,
      },
    },
  }

  return {
    [`${Button}`]: {
      display: "grid",
      background: "none",
      gridTemplateColumns: "auto 1fr",
      gridColumnGap: `${theme.base.gutter / 2}px`,
      alignSelf: "end",
      alignItems: "center",
      height: "auto",
      padding: 0,
      ...styles[type],
      [":hover"]: {
        ...hoverStyles[type],
      },
    },
  }
})

export { ButtonWrapper }
