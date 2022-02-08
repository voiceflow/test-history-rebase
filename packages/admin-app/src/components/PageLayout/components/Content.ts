import { styled } from '@/styles';

const Content = styled.div`
  flex-basis: 0;
  flex-grow: 999;
  min-width: calc(50% - 1rem);
  height: 100vh;

  overflow-y: scroll;

  padding: 2rem;
`;

export default Content;
