import _isNumber from 'lodash/isNumber';
import React from 'react';

import client from '@/client';
import Canvas from '@/components/Canvas';
import { RenderLayer } from '@/components/Canvas/components';
import { FeatureFlag } from '@/config/features';
import * as Creator from '@/ducks/creator';
import * as Skill from '@/ducks/skill';
import { connect, styled } from '@/hocs';
import { useFeature } from '@/hooks';
import { Node } from '@/models';
import BlockContainer from '@/pages/Canvas/components/Block/components/BlockContainer';
import NodeLayer from '@/pages/Canvas/components/CanvasDiagram/components/NodeLayer';
import LinkLayer from '@/pages/Canvas/components/LinkLayer';
import LinkLayerSvg from '@/pages/Canvas/components/LinkLayer/components/LinkLayerSvg';
import MarkupLayer from '@/pages/Canvas/components/MarkupLayer';
import NodeContainer from '@/pages/Canvas/components/Node/components/NodeContainer';
import { CanvasProviders, EditPermissionProvider, ManagerProvider, PresentationModeProvider } from '@/pages/Canvas/contexts';
import useEngine from '@/pages/Canvas/engine';
import { getManager } from '@/pages/Canvas/managers';
import { Point } from '@/types';
import { compose } from '@/utils/functional';

import ExportStyle from './ExportStyle';

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
    pointer-events: none;
  }

  ${LinkLayerSvg} {
    flex: 1;
    height: auto;
    width: auto;
  }

  ${NodeContainer} {
    margin-bottom: ${EXPORT_MARGIN}px;

    ${BlockContainer} {
      margin-right: ${EXPORT_MARGIN}px;
      position: relative;
      transform: none;
    }
  }
`;

const AnyCanvasProviders = CanvasProviders as any;

const ExportCanvas: React.FC<{ diagramID: string; initialize: (diagramID: string) => void }> = ({ diagramID, initialize }) => {
  const engine = useEngine();
  const markup = useFeature(FeatureFlag.MARKUP);

  React.useEffect(() => {
    initialize(diagramID);
  }, []);

  const registerCanvas = React.useCallback((api) => engine.registerCanvas(api), []);

  return (
    <PresentationModeProvider>
      <ManagerProvider value={getManager as any}>
        <EditPermissionProvider isPrototyping={false}>
          <AnyCanvasProviders engine={engine}>
            <ExportStyle />
            <ExportCanvasDiagram onRegister={registerCanvas}>
              <LinkLayer />
              <NodeLayer />
              {markup.isEnabled && <MarkupLayer />}
            </ExportCanvasDiagram>
          </AnyCanvasProviders>
        </EditPermissionProvider>
      </ManagerProvider>
    </PresentationModeProvider>
  );
};

const findCanvasExportOffsets = (nodes: Node[]): Point => {
  const xValues = nodes.map((node) => node.x);
  const yValues = nodes.map((node) => node.y);

  const minX = Math.min(...xValues);
  const minY = Math.min(...yValues);

  return [0 - minX, 0 - minY];
};

const applyCanvasExportOffsets = (nodes: Node[], [offsetX, offsetY]: Point) =>
  nodes.map((node) => ({
    ...node,
    x: node.x + offsetX,
    y: node.y + offsetY,
  }));

const initialize = (diagramID: string) => async (dispatch: any, getState: any) => {
  const state = getState();
  const platform = Skill.activePlatformSelector(state);

  const {
    data: { viewport, ...creator },
  } = await client.diagram.getData(diagramID, platform);

  const nodesWithCoordinates = creator.nodes.filter((node) => _isNumber(node.x) && _isNumber(node.y));
  const offsets = findCanvasExportOffsets(nodesWithCoordinates);

  creator.nodes = applyCanvasExportOffsets(nodesWithCoordinates, offsets);

  dispatch(Creator.initializeCreator({ ...creator, diagramID }));
};

export default compose(React.memo, connect(null, { initialize }))(ExportCanvas);
