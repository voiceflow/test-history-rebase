import { styled } from '@/hocs';
import { CANVAS_MARKUP_ENABLED } from '@/pages/Canvas/constants';

const LinkLayerSvg = styled.svg`
  overflow: visible;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  position: absolute;

  .${CANVAS_MARKUP_ENABLED} & {
    pointer-events: none !important;
  }
`;

export default LinkLayerSvg;
