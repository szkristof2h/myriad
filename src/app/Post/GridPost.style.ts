import { FC } from "react"
import styled from "styled-components"
import theme from "../theme"
import { Header, UserHeader } from "../Typography/Typography.style"
import * as Styled from "./Rater.style"
import sample from "../images/add.svg"

interface Props {
  gridSize: "small" | "medium" | "big"
}

interface GridPostProps {
  column?: number
  gridSize: "small" | "medium" | "big"
  image: string
  isSample: boolean
  row?: number
  size: number
}

const DetailsContainer = styled.div({
  background: "rgba(0, 0, 0, 0.4)",
  display: "none",
  "&:hover": {
    cursor: "pointer",
  },
})

const HeaderContainer: FC<Props> = styled.div(({ gridSize }) => {
  const padding = {
    header: {
      small: `${theme.base.gutter / 4}px ${theme.base.gutter / 4}px ${
        theme.base.gutter / 8
      }px ${theme.base.gutter / 4}px`,
      medium: `${theme.base.gutter / 2}px ${theme.base.gutter / 2}px ${
        theme.base.gutter / 4
      }px ${theme.base.gutter / 2}px`,
      big: `${theme.base.gutter}px ${theme.base.gutter}px ${
        theme.base.gutter / 2
      }px ${theme.base.gutter}px`,
    },
    userHeader: {
      small: `0 ${theme.base.gutter / 4}px`,
      medium: `0 ${theme.base.gutter / 2}px`,
      big: `0 ${theme.base.gutter}px`,
    },
  }

  return {
    display: "grid",
    gridColumn: "1 / span 2",
    alignSelf: "start",
    gridRow: 1,
    [`${Header}, ${UserHeader}`]: {
      alignSelf: "start",
      overflow: "hidden",
      maxWidth: "100%",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    [`${Header}`]: {
      gridRow: 1,
      padding: padding.header[gridSize],
    },
    [`${UserHeader}`]: {
      padding: padding.userHeader[gridSize],
      gridRow: 2,
    },
  }
})

const GridPost: FC<GridPostProps> = styled.div(props => {
  const { column, gridSize, image, isSample, row, size } = props
  const iconSize = {
    small: "20px",
    medium: "30px",
    big: "40px",
  }

  return {
    background: `gray url('${!isSample ? image : sample}') no-repeat center`,
    backgroundSize: isSample ? `70px 70px` : column ? "cover" : "auto auto",
    gridColumn: `${"" + column + " / span " + size}`,
    gridRow: `${"" + row + " / span " + size}`,
    border: "1px solid black",
    fontSize: "1rem",
    color: "white",
    "&:hover": {
      cursor: "pointer",
      [`${DetailsContainer}`]: {
        display: "grid",
        height: "100%",
      },
    },
    [`${Styled.ButtonWrapper}`]: {
      gridRow: 2,
      alignSelf: "end",
      justifySelf: "center",
      padding: `${theme.base.gutter}px 0`,
      svg: {
        width: iconSize[gridSize],
        height: iconSize[gridSize],
      },
    },
  }
})

export { DetailsContainer, HeaderContainer, GridPost }
