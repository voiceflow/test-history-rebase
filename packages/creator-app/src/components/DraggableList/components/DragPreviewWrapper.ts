import { css, styled, transition } from '@/hocs/styled';

interface DragPreviewWrapper {
  deleteHovered?: boolean;
}

const DragPreviewWrapper = styled.div<DragPreviewWrapper>`
  z-index: 10000000;
  pointer-events: none;
  transform: scale(1);
  ${transition('transform')};

  ${({ deleteHovered }) =>
    deleteHovered &&
    css`
      transform: scale(0.8);
    `}
`;

export default DragPreviewWrapper;
