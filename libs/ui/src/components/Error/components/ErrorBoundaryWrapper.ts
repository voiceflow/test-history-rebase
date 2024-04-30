import { colors, styled, ThemeColor } from '@/styles';

import { centerContent } from '../styles';

const ErrorBoundaryWrapper = styled.div`
  ${centerContent};

  h4 {
    margin-top: 1rem;
  }

  p {
    margin-top: 1rem;
    color: ${colors(ThemeColor.SECONDARY)};
  }
`;

export default ErrorBoundaryWrapper;
