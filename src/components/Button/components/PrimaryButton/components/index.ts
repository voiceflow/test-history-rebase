import { css, styled } from '@/hocs';

import Container from './PrimaryButtonContainer';
import Icon from './PrimaryButtonIcon';

export { Container, Icon };

export type PrimaryButtonLabelProps = {
  isLoading?: boolean;
};

const PrimaryButtonLabel = styled.span<PrimaryButtonLabelProps>`
  ${({ isLoading }) =>
    isLoading
      ? css`
          padding: 0 9px;
          pointer-events: none;
        `
      : css`
          padding: 0 22px;
        `}
`;

export { PrimaryButtonLabel as Label };
