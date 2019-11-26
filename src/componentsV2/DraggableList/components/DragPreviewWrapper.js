import { css, styled, transition } from '@/hocs';

const DragPreviewWrapper = styled.div`
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
