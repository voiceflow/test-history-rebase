import { cardStyles } from '@/componentsV2/Card';
import { flexCenterStyles } from '@/componentsV2/Flex';
import { mergeOverlayStyles } from '@/containers/CanvasV2/components/MergeOverlay/styles';
import { styled } from '@/hocs';

const BlockOverlay = styled.div`
  ${cardStyles}
  ${flexCenterStyles}

  position: absolute;
  top: -5px;
  height: calc(100% + 4px);
  width: calc(100% - 2px);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-style: solid;
  padding: 0;
  pointer-events: none;
  box-sizing: content-box;

  ${mergeOverlayStyles}
`;

export default BlockOverlay;
