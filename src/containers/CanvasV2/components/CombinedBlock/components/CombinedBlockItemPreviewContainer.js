import NestedBlockContainer from '@/containers/CanvasV2/components/NestedBlock/components/NestedBlockContainer';
import { css, styled } from '@/hocs';

import { combinedBlockItemContainerStyles } from './CombinedBlockItemContainer';

const CombinedBlockItemPreviewContainer = styled(NestedBlockContainer)`
  ${combinedBlockItemContainerStyles}

  ${({ rect, zoom }) =>
    css`
      width: ${rect.width / zoom}px;
      transform-origin: top left;
      transform: scale(${zoom});
    `}
`;

export default CombinedBlockItemPreviewContainer;
