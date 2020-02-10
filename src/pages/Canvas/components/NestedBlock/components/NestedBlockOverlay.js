import Overlay, { offsetOverlayStyles } from '@/components/Overlay';
import { css, styled } from '@/hocs';

const NestedBlockOverlay = styled(Overlay)`
  ${offsetOverlayStyles(1)}

  border: 1px solid transparent;
  box-sizing: border-box;

  ${({ isSelected, color }) =>
    isSelected &&
    css`
      border-color: ${color};
    `}
`;

export default NestedBlockOverlay;
