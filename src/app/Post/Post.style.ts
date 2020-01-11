import styled from "styled-components";
import theme from "../theme";
import { Header, UserHeader } from "../Typography/Typography.style";

const StyledPost = styled.div`
  border: 1px solid black;
  display: grid;
  grid-template-rows: 4fr 1fr;
  font-size: 1rem;
  color: white;
  &:hover {
    cursor: pointer;
    .details {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
  > .details {
    display: none;
    grid-row: 2;
    &:hover {
      cursor: default;
    }
    > .personal {
      display: grid;
      grid-column: 1 / span 2;
      justify-items: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.4);
      ${Header}, & > .user {
        overflow: hidden;
        max-width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      ${Header} {
        grid-row: 1;
        padding: 0 ${theme.base.gutter / 4}px;
        &:hover {
          cursor: pointer;
        }
      }
      > .user {
        grid-row: 2;
      }
    }
  }
`;

const StyledPostOpen = styled.div`
  display: grid;
  background: white;
  max-height: calc(100% - 20px);
  grid-template-columns: 1fr 400px;
  grid-template-rows: repeat(3, auto) 1fr auto;
  grid-column-gap: ${theme.base.gutter / 2}px;
  margin: 10px 40px 25px 40px;
  padding: 0 ${theme.base.gutter}px 0 0;
  text-align: center;
  overflow: hidden;
  .image-container {
    display: grid;
    position: relative;
    grid-column: 1;
    grid-row: 1 / span 5;
    max-width: 100%;
    max-height: 100%;
    justify-content: center;
    align-content: center;
    background: black;
    & > .button--previous {
      position: absolute;
      top: 50%;
      left: ${theme.base.gutter * 2}px;
      transform: translate(0, -50%);
    }
    & > .button--next {
      position: absolute;
      top: 50%;
      right: ${theme.base.gutter * 2}px;
      transform: translate(0, -50%);
    }
    & > .image {
      object-fit: contain;
      min-width: 1px;
      min-height: 1px;
      justify-self: stretch;
      align-self: stretch;
    }
  }
  ${Header} {
    display: initial;
    grid-column: 2;
    grid-row: 1;
    padding-bottom: 0;
  }
  ${UserHeader} {
    grid-column: 2;
    grid-row: 2;
    &:hover {
      text-decoration: underline;
    }
    padding-bottom: ${theme.base.gutter}px;
  }
  .summary {
    display: initial;
    grid-column: 2;
    grid-row: 3;
    text-align: justify;
    word-break: break-word;
    border-bottom: 1px solid ${theme.color.divider};
    padding: ${theme.base.gutter / 2}px;
    margin-bottom: ${theme.base.gutter / 2}px;
  }
  .buttons {
    display: grid;
    grid-column: 2;
    grid-row: 5;
    grid-column-gap: ${theme.base.gutter / 2}px;
    grid-template-columns: auto auto 1fr auto auto;
    padding: ${theme.base.gutter / 2}px;
    .share-icon {
      &--facebook:hover {
        fill: #3b5998;
      }
      &--twitter:hover {
        fill: #0084b4;
      }
    }
  }
  .comments {
    grid-column: 2;
    grid-row: 4;
  }
`;

export { StyledPost, StyledPostOpen };
