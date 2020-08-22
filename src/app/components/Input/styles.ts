import styled from "styled-components"
import theme from "../../theme"
import { Error } from "../../Typography/Typography.style"

const Input = styled.input({
  border: "none",
  borderBottom: "1px solid black",
  marginBottom: `${theme.base.gutter * 1.5}px`,
  "&:focus": {
    outline: "none",
  },
  [`+ ${Error}`]: {
    paddingBottom: `${theme.base.gutter * 1.5}px`,
  },
})

export default Input
