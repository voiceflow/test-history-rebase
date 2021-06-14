import ButtonContainer from '@/components/Button/components/ButtonContainer';
import * as SvgIcon from '@/components/SvgIcon';
import { styled, transition } from '@/hocs';

export type SquareContainerProps = {
  hoverColor?: string;
};

const SquareContainer = styled(ButtonContainer)<SquareContainerProps>`
  border-style: none;
  ${transition('background', 'border')}
  padding: 12px;
  border-radius: 5px;
  border: solid 1px transparent;

  & ${SvgIcon.Container} {
    color: #8da2b5;
    max-width: 16px;
  }

  &:hover {
    background: rgba(238, 244, 246, 0.85);
    border: solid 1px #dfe3ed;
  }
`;

export default SquareContainer;
