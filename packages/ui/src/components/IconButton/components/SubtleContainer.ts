import { colors, styled } from '../../../styles';
import { ButtonContainer } from '../../Button';
import { SvgIconContainer } from '../../SvgIcon';
import { IconButtonVariant } from '../types';
import { BaseContainerProps } from './IconButtonContainer';

export interface SubtleContainerProps extends BaseContainerProps {
  variant: IconButtonVariant.SUBTLE;
  hoverColor?: string;
}

const SubtleContainer = styled(ButtonContainer)<SubtleContainerProps>`
  border-style: none;

  & ${SvgIconContainer} {
    max-width: 16px;
    color: ${colors('tertiary')};
  }

  &:hover ${SvgIconContainer} {
    color: ${({ hoverColor = '#2e3852' }) => hoverColor};
  }
`;

export default SubtleContainer;
