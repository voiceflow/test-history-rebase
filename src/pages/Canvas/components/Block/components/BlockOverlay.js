import { cardStyles } from '@/componentsV2/Card';
import { flexCenterStyles } from '@/componentsV2/Flex';
import { styled } from '@/hocs';
import { mergeOverlayStyles } from '@/pages/Canvas/components/MergeOverlay/styles';

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
