import ButtonContainer from '@/components/Button/components/ButtonContainer';
import * as SvgIcon from '@/components/SvgIcon';
import { styled } from '@/hocs';

export type SubtleContainerProps = {
  hoverColor?: string;
};

const SubtleContainer = styled(ButtonContainer)<SubtleContainerProps>`
  border-style: none;

  & ${SvgIcon.Container} {
    color: #8da2b5;
    max-width: 16px;
  }

  &:hover ${SvgIcon.Container} {
    color: ${({ hoverColor = '#2e3852' }) => hoverColor};
  }
`;

export default SubtleContainer;
