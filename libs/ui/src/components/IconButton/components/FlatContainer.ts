import type { IconButtonVariant } from '@/components/IconButton/types';
import { styled } from '@/styles';

import type { IconButtonContainerSharedProps } from './IconButtonContainer';
import IconButtonContainer, { activeStyle } from './IconButtonContainer';

export interface FlatContainerProps extends IconButtonContainerSharedProps {
  variant: IconButtonVariant.FLAT;
}

const FlatContainer = styled(IconButtonContainer)<FlatContainerProps>`
  color: #8da2b5;
  background: inherit;
  box-shadow: none;

  &:hover {
    color: #8da2b5;
  }

  ${({ active }) => active && activeStyle}
`;

export default FlatContainer;
