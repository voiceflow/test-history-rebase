import { styled, transition } from '../../../styles';
import { ButtonContainer } from '../../Button';
import { SvgIconContainer } from '../../SvgIcon';

export type SquareContainerProps = {
  hoverColor?: string;
};

const SquareContainer = styled(ButtonContainer)<SquareContainerProps>`
  ${transition('background', 'border')}
  padding: 12px;
  border: solid 1px transparent;
  border-style: none;
  border-radius: 5px;

  & ${SvgIconContainer} {
    max-width: 16px;
    color: #8da2b5;
  }

  &:hover {
    background: rgba(238, 244, 246, 0.85);
    border: solid 1px #dfe3ed;
  }
`;

export default SquareContainer;
