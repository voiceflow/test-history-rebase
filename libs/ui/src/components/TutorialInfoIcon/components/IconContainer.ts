import { css, styled, transition } from '@ui/styles';

export interface IconContainerProps {
  isOpen: boolean;
  visible: boolean;
}

const IconContainer = styled.div<IconContainerProps>`
  ${transition('color', 'opacity')}
  position: relative;
  cursor: pointer;
  display: inline-block;
  color: #becedc;

  ${({ isOpen }) =>
    isOpen &&
    css`
      color: #5d9df5 !important;
    `}

  ${({ visible }) =>
    !visible &&
    css`
      opacity: 0;
    `}

  &:hover {
    color: #8da2b5;
  }
`;

export default IconContainer;
