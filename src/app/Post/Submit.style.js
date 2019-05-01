import styled from "styled-components";

const StyledSubmit = styled.div`
  display: grid;
  font-size: 1rem;
  grid-column-gap: 3px;
  grid-template-columns: 1fr 1fr 1fr;
  > .header {
    grid-column: 1 / span 3;
  }
  > .label {
    grid-column: 1 / span 3;
  }
  > .input {
    grid-column: 1 / span 3;
  }
  > .image-text {
    grid-column: 1 / span 3;
  }
  > .image-container {
    max-width: 100%;
    height: fit-content;
    &--active {
      border: 3px solid black;
    }
    > .image {
      display: block;
      max-width: inherit;
    }
  }
  > .button {
    grid-column: 1 / span 3;
    width: 100%;
    .submit__error {
      text-align: center;
      font-family: "Artifika";
    }
  }
`;

export default StyledSubmit;