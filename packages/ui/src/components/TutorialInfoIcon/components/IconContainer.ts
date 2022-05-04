import { css, styled, transition } from '@ui/styles';

export interface IconContainerProps {
  isOpen: boolean;
}

const IconContainer = styled.div<IconContainerProps>`
  ${transition('color')}
  position: relative;
  cursor: pointer;
  display: inline-block;
  color: #becedc;
  top: 3px;

  ${({ isOpen }) =>
    isOpen &&
    css`
      color: #5d9df5 !important;
    `}

  &:hover {
    color: #8da2b5;
  }
`;

export default IconContainer;
