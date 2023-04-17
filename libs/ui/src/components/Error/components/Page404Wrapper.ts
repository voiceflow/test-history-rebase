import { colors, styled, ThemeColor } from '@ui/styles';

import { centerContent } from '../styles';

const Page404Wrapper = styled.div`
  ${centerContent};

  h4 {
    margin-top: 1rem;
  }

  p {
    margin-top: 8px;
    color: ${colors(ThemeColor.SECONDARY)};
  }
`;

export default Page404Wrapper;
