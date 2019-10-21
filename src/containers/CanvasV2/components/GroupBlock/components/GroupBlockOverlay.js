import Overlay, { offsetOverlayStyles } from '@/components/Overlay';
import { mergeOverlayStyles } from '@/containers/CanvasV2/components/MergeOverlay/styles';
import { css, styled } from '@/hocs';

const GroupBlockOverlay = styled(Overlay)`
  ${mergeOverlayStyles}
  ${offsetOverlayStyles(2)}

  ${({ canMerge }) =>
    canMerge &&
    css`
      visibility: hidden;
    `}
`;

export default GroupBlockOverlay;
