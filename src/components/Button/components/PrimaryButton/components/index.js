import { css, styled } from '@/hocs';

import Container from './PrimaryButtonContainer';
import Icon from './PrimaryButtonIcon';

export { Container, Icon };

const PrimaryButtonLabel = styled.span`
  ${({ loading }) =>
    loading
      ? css`
          padding: 0 9px;
          pointer-events: none;
        `
      : css`
          padding: 0 22px;
        `}
`;

export { PrimaryButtonLabel as Label };
