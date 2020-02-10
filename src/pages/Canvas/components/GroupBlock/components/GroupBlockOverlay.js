import Overlay, { offsetOverlayStyles } from '@/components/Overlay';
import { css, styled } from '@/hocs';
import { mergeOverlayStyles } from '@/pages/Canvas/components/MergeOverlay/styles';

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
