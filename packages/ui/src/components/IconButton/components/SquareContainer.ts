import { colors, styled, transition } from '../../../styles';
import { ButtonContainer } from '../../Button';
import { SvgIconContainer } from '../../SvgIcon';
import { IconButtonVariant } from '../types';
import { BaseContainerProps } from './IconButtonContainer';

export interface SquareContainerProps extends BaseContainerProps {
  variant: IconButtonVariant.SQUARE;
}

const SquareContainer = styled(ButtonContainer)<SquareContainerProps>`
  ${transition('background', 'border')}

  padding: 12px;
  border: solid 1px transparent;
  border-radius: 5px;

  & ${SvgIconContainer} {
    max-width: 16px;

    color: ${colors('tertiary')};
  }

  &:hover {
    background: rgba(238, 244, 246, 0.85);
    border: solid 1px ${colors('borders')};
  }
`;

export default SquareContainer;
