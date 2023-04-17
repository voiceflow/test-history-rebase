import { styled, transition } from '@/hocs/styled';

const Divider = styled.div`
  ${transition('background-color')}
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.borders};
  cursor: row-resize;
  z-index: 2;
  pointer-events: auto;

  &:hover {
    background-color: ${({ theme }) => theme.colors.blue};
  }

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: 0;
    right: 0;
    bottom: -2px;
    cursor: row-resize;
  }

  &.resizing:before {
    top: -10px;
    bottom: -10px;
  }
`;

export default Divider;
