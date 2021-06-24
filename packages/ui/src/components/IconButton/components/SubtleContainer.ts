import { styled } from '../../../styles';
import { ButtonContainer } from '../../Button';
import { SvgIconContainer } from '../../SvgIcon';

export type SubtleContainerProps = {
  hoverColor?: string;
};

const SubtleContainer = styled(ButtonContainer)<SubtleContainerProps>`
  border-style: none;

  & ${SvgIconContainer} {
    max-width: 16px;
    color: #8da2b5;
  }

  &:hover ${SvgIconContainer} {
    color: ${({ hoverColor = '#2e3852' }) => hoverColor};
  }
`;

export default SubtleContainer;
