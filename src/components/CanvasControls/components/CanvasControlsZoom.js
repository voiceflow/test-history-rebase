import Flex from '@/componentsV2/Flex';
import * as IconButton from '@/componentsV2/IconButton';
import { styled } from '@/hocs';

const CanvasControlsZoom = styled(Flex)`
  & ${IconButton.Container} {
    box-shadow: none;
  }

  & ${IconButton.Container}:not(:last-of-type) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  & ${IconButton.Container}:not(:first-of-type) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

export default CanvasControlsZoom;
