import Canvas from '@/components/Canvas';
import { RenderLayer } from '@/components/Canvas/components';
import { styled } from '@/hocs/styled';
import BlockContainer from '@/pages/Canvas/components/Block/components/BlockContainer';
import * as ChipStyles from '@/pages/Canvas/components/Chip/styles';
import DragTarget from '@/pages/Canvas/components/DragTarget';
import LinkLayerSvg from '@/pages/Canvas/components/LinkLayer/components/LinkLayerSvg';
import { Container as MarkupChildNodeContainer } from '@/pages/Canvas/components/MarkupNode/components';
import NodeContainer from '@/pages/Canvas/components/Node/components/NodeContainer';

const EXPORT_MARGIN = 40;

const ExportCanvasDiagram = styled(Canvas as any)`
  height: auto;
  width: auto;
  overflow: visible;
  position: static;
  user-select: auto;
  margin-top: ${EXPORT_MARGIN}px;
  margin-left: ${EXPORT_MARGIN}px;

  ${RenderLayer} {
    position: relative;
    transform: translate(0, 0) !important;
    height: 100% !important;
    width: 100% !important;
    pointer-events: none;

    > div {
      transform: none !important;
    }
  }

  ${LinkLayerSvg} {
    flex: 1;
    height: auto;
    width: auto;
  }

  ${NodeContainer} {
    ${BlockContainer} {
      position: relative;
      transform: none;
    }

    ${ChipStyles.Container} {
      position: relative;
      transform: none;
    }
  }

  ${DragTarget} {
    ${MarkupChildNodeContainer} {
      position: relative;
    }
  }
`;

export default ExportCanvasDiagram;
