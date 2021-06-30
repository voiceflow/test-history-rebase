import { colors, styled } from '../../../styles';
import { centerContent } from '../styles';

const Page404Wrapper = styled.div`
  ${centerContent};

  h4 {
    margin-top: 1rem;
  }

  p {
    margin-top: 1rem;
    color: ${colors('secondary')};
  }
`;

export default Page404Wrapper;
