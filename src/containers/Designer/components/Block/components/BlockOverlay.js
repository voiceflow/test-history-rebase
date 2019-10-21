import Overlay, { offsetOverlayStyles } from '@/components/Overlay';
import { styled } from '@/hocs';

import BlockContainer from './BlockContainer';

const BlockOverlay = styled(Overlay)`
  ${offsetOverlayStyles(2)}

  border: 1px solid #dddddd;

  ${BlockContainer}:focus &,
  ${BlockContainer}:focus-within & {
    border-color: #666666;
  }
`;

export default BlockOverlay;
