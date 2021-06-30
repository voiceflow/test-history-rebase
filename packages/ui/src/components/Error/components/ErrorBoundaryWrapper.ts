import { colors, styled } from '../../../styles';
import { centerContent } from '../styles';

const ErrorBoundaryWrapper = styled.div`
  ${centerContent};

  h4 {
    margin-top: 1rem;
  }

  p {
    margin-top: 1rem;
    color: ${colors('secondary')};
  }
`;

export default ErrorBoundaryWrapper;
