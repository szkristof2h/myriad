import styled from "styled-components"
import theme from "../theme"
import { Box } from "../components/Box.style"

export const EditProfile = styled(Box)({
  display: "grid",
  justifyContent: "center",
  justifySelf: "center",
  gridRowGap: `${theme.base.gutter / 2}px`,
  wordBreak: "break-all",
  marginTop: `${theme.base.gutter / 2}px`,
  gridTemplateRows: "initial",
  "> img": {
    justifySelf: "center",
    width: "200px",
    height: "200px",
    marginBottom: `${theme.base.gutter}px`,
  },
})
