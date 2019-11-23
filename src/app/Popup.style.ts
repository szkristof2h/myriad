import styled from 'styled-components'

const styles = {
  basic: "",
  scrollY: `overflow-y: scroll;`,
  post: `justify-content: initial; justify-items: initial; align-content: initial;`,
  profile: `align-content: start; overflow-y: scroll;`,
  submit: `align-content: start;`,
}

const StyledPopup = ({ type }) => {
  const style = `
    display: grid;
    position: fixed;
    width: 100%;
    height: 100%;
    justify-content: center;
    justify-items: center;
    align-content: center;
    ${styles[type]}
  `
  return styled.div(style)
}

export default StyledPopup