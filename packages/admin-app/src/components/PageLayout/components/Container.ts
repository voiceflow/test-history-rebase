import { styled } from '@/styles';

const Container = styled.div`
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

export default Container;
