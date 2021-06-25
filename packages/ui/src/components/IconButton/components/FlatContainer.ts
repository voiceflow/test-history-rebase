import { styled } from '../../../styles';
import { IconButtonVariant } from '../types';
import IconButtonContainer, { activeStyle, IconButtonContainerSharedProps } from './IconButtonContainer';

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
