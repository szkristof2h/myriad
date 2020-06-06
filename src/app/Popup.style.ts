import styled from "styled-components"
import { FC } from "react"

interface Props {
  type: "basic" | "scrollY" | "post" | "profile" | "submit"
  onClick: Function
}

const styles = {
  basic: "",
  scrollY: { "overflow-y": scroll },
  post: {
    justifyContent: "initial",
    justifyItems: "initial",
    alignContent: "initial",
  },
  profile: { alignContent: "start", overflowY: "scroll" },
  submit: { alignContent: "start" },
}

const StyledPopup: FC<Props> = styled.div(({ type }) => ({
  ...{
    display: "grid",
    position: "fixed",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    justifyItems: "center",
    alignContent: "center",
  },
  ...styles[type],
}))

export default StyledPopup
