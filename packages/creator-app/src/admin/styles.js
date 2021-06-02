import styled from 'styled-components';

export const AdminWrapper = styled.div`
  * {
    box-sizing: border-box;
    transition: background-color 0.2s ease;
  }

  color: ${(props) => props.theme.palette.text.primary};
  font-size: 15px;
  font-weight: 200;
  /* font-family: 'Lato', sans-serif; */
  font-family: 'Open Sans', sans-serif;
  letter-spacing: 0.1px;
  background-color: ${(props) => props.theme.palette.background.default};
  transition: background-color 0.15s ease;
  height: 100%;

  overflow: hidden;

  & > * {
    display: flex;
    flex-wrap: wrap;
    margin: -0.5rem;
    margin-bottom: 0;
    height: 100vh;
  }

  & > * > * {
    margin: 0.5rem;
    margin-bottom: 0;
  }

  input,
  input:active {
    background-color: ${(props) => props.theme.palette.background.highlight};
  }
`;

export const AdminTitle = styled.div`
  font-size: 32px;
  line-height: 1;
`;

export const PageWrapper = styled.div`
  flex-basis: 0;
  flex-grow: 999;
  min-width: calc(50% - 1rem);
  height: 100vh;

  overflow-y: scroll;

  padding: 2rem;
`;
